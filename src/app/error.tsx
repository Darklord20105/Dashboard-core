'use client';

import { useEffect } from 'react';

export default function GlobalError({ 
  error, 
  reset 
}: { 
  error: Error; 
  reset: () => void; 
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
        <p className="mt-2 text-gray-600">{error.message}</p>
        <button 
          onClick={reset}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
