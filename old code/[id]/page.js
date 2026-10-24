// src/app/users/[id]/page.js
import { createGetOne } from '@/src/lib/GET';
import User from '@/src/models/User';
import mongoose from 'mongoose';
import { notFound } from 'next/navigation';

// Initialize the query with your User schema config
const getUser = createGetOne(User, {
    populateFields: [],
    validateId: true,
    restrictedFields: ['password', 'refreshToken', 'internalNotes'],
    defaultFields: 'name email role createdBy',
});

export default async function UsersPage({ params }) {
    // 1. Await Next.js 16 query parameters
    const reslovedParams = await params;
    const id = reslovedParams.id;

    // 1. Validate ID format safely
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return notFound(); // Triggers Next.js 404 page
    }

    // 2. Execute your converted Express-style filters completely on the server!
    const response = await getUser(id);

    if (response.status === 'error') {
        return <div className="p-8 text-red-500">Failed to load system users. {response.message}</div>;
    }

    let user = response.data;

    return (
        <div className="min-h-screen bg-slate-50 p-8 text-slate-800">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">User Directories</h1>
                <p className="text-sm text-slate-500 mb-6">Total Records: {response.total}</p>

                {/* User List Output */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div key={user._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-50 text-blue-700 uppercase tracking-wider">
                                    {user.jobTitle}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">{user.email}</p>
                            <p className="text-sm text-slate-600 mt-1">📞 {user.phone}</p>

                            {/* Visualizing dynamic deep nested populated data safely */}
                            {user.supplierId && (
                                <p className="text-xs bg-slate-100 p-2 rounded mt-3 text-slate-600">
                                    🏢 Supplier: <span className="font-medium text-slate-900">{user.supplierId.name || 'Assigned'}</span>
                                </p>
                            )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                            <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                            <span className={user.kyc?.verified ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                                {user.kyc?.verified ? "✓ KYC Verified" : "⚠ KYC Pending"}
                            </span>
                        </div>
                    </div>

                </div>

                {response.data.length === 0 && (
                    <p className="text-center text-slate-400 mt-10">No users match your query parameters.</p>
                )}
            </div>
        </div>
    );
}
