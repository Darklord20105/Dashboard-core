'use client'

// Component Imports
import { Card } from '@/src/components/ui/card'
import { UserPagination } from '@/src/views/admin/list/user-pagination';

import AdminSimpleUserTable from "@/src/views/admin/permissions/table/admin-user-table"
import AdminSimpleUserTableFilters from '@/src/views/admin/permissions/table/admin-user-table-filter';
import AdminSimpleUserTableToolbar from '@/src/views/admin/permissions/table/admin-user-table-toolbar';

// Hook Imports
import { useUserApp } from '@/src/hooks/use-user-app'

export default function AdminListUsers({ initialUsers, onSelectUser }) {
        const { items} = initialUsers;
        const {
        filters,
        paginatedUsers,
        totalPages,
        totalFilteredCount,
        showingFrom,
        showingTo,
        rowsPerPage,
        currentPage,
        sorting,
        handleFilterChange,
        handleSearchChange,
        handleRowsPerPageChange,
        handlePageChange,
        handleSortingChange
        } = useUserApp({ initialUsers: items })
    return (
        <div className='flex flex-col gap-3 lg:gap-6'>
            <Card className='py-0 shadow-none'>
                <div className='w-full'>
                    <div className='border-b'>
                        <AdminSimpleUserTableFilters filters={filters} onFilterChange={handleFilterChange} />
                        <AdminSimpleUserTableToolbar
                            search={filters.search ?? ""}
                            rowsPerPage={rowsPerPage ?? 10}
                            onSearch={handleSearchChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                        />

                        {initialUsers.error ?
                            <AdminSimpleUserTable
                                paginatedUsers={[]}
                                totalPages={1}
                                sorting={null}
                                onSortingChange={handleSortingChange}
                                tableError={initialUsers.error}
                                onSelectUser={onSelectUser}
                            /> :
                            <AdminSimpleUserTable
                                paginatedUsers={paginatedUsers || []}
                                totalPages={totalPages ?? 1}
                                sorting={sorting ?? null}
                                onSortingChange={handleSortingChange}
                                tableError={null}
                                onSelectUser={onSelectUser}
                            />}
                    </div>

                    <UserPagination
                        showingFrom={showingFrom ?? 0}
                        showingTo={showingTo ?? 0}
                        total={totalFilteredCount ?? 0}
                        currentPage={currentPage ?? 1}
                        totalPages={totalPages ?? 1}
                        onPageChange={handlePageChange}
                    />
                </div>
            </Card>
        </div>
    )
}