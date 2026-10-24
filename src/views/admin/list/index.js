'use client'
import { useEffect, useState } from "react"

// Component Imports
import { Card } from '@/src/components/ui/card'
import { TableLoader } from '@/src/components/shared/TableState/TableLoader'
import { TableError } from '@/src/components/shared/TableState/TableError'

import { UserPagination } from './user-pagination'
import { UserTable } from './user-table'
import { UserTableFilters } from './user-table-filters'
import { UserTableToolbar } from './user-table-toolbar'
import { AddEditUserSheet } from './dialogs/add-user-sheet'

// utils imports
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/src/lib/auth-client"
import { addNewUserAction } from "@/src/app/(pages)/admin/admin-list-user/actions"
import { toast } from 'sonner'
import { errorToast, successToast } from "@/src/components/ui/sonner";

// Hook Imports
import { useUserApp } from '@/src/hooks/use-user-app'


const UserListApp = () => {
  /* 
    FETCHING USERS LIST
  */
  const {
    data: initialUsers,
    error,
    refetch,
    isLoading,    // True ONLY on the very first mount with no data
    isRefetching, // True ONLY during manual .refetch() calls
    isFetching    // True during ANY network request (initial + updates)
  } = useQuery({
    queryKey: ['users-list'],
    queryFn: async () => {
      // await delay(2000)  // to test loaders
      const response = await authClient.admin.listUsers({
        query: { limit: 100 }
      })

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch users');
      }

      return response.data.users;
    },
    structuralSharing: false, // to force refetch even if data is the same

  });

  /* 
    ADDING NEW USER
  */
  const handleCreateNewUserData = async (data) => {
    // console.log(data)
    const adminCreateNewUserPromise = async () => {
      try {
        const result = await addNewUserAction({
          name: data.name,
          email: data.email,
          role: data.role,
          password: data.password
        })

        if (result && !result.success) {
          // 🌟 Throwing the message forces toast to switch to the "error" style instantly
          throw new Error(result.error || "Failed to synchronize privileges.");
        }

        setIsEditSheetOpen(false)
        refetch()
        return (result?.message || "User Data update Success.");
      } catch (error) {
        throw new Error(error);
      }  
    }
    await toast.promise(adminCreateNewUserPromise(), {
      loading: "Synchronizing Database...",
      success: () => {
        const message = "user data update success!"
        return successToast(message)
      },
      error: (err) => {
        return errorToast(err.message)
      },
    });

    // addNewUserAction()
  }
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  useEffect(() => {
    refetch()
  }, [refetch])

  /*
    TABLE, SORT, SEARCH, FILTER
  */
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
  } = useUserApp({ initialUsers })

  return (
    <div className='flex flex-col gap-3 lg:gap-6'>
      <Card className='py-0 shadow-none'>
        <div className='w-full'>
          <div className='border-b'>
            <UserTableFilters filters={filters} onFilterChange={handleFilterChange} />
            <UserTableToolbar
              toggle={setIsEditSheetOpen}
              search={filters.search ?? ""}
              rowsPerPage={rowsPerPage ?? 10}
              onSearch={handleSearchChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />

            {isFetching ? <TableLoader /> : (
              error ? <TableError error={error} refetch={refetch} /> : (
                <UserTable
                  paginatedUsers={paginatedUsers || []}
                  totalPages={totalPages ?? 1}
                  sorting={sorting ?? null}
                  onSortingChange={handleSortingChange}
                  refetch={refetch}
                />
              )
            )}
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
      {/* // Add new User */}
      <AddEditUserSheet
        mode={isEditSheetOpen ? 'add' : null}
        onClose={() => setIsEditSheetOpen(false)}
        onAdd={handleCreateNewUserData}
        // onEdit={() => { }} the functionality exist but we dont need it now
      />
    </div>
  )
}

export default UserListApp

// const [isLockdown, setIsLockdown] = useState(false);


    // setIsLockdown(true);

    // const AdminCreateUserAction = async () => {
    //   try {

    //     const { data, error: authError } = await authClient.admin.createUser({
    //       name: values.name,
    //       email: values.email,
    //       role: values.role,
    //       password: values.password,
    //     });

    //     if (authError) {
    //       if (authError.status === 500) {
    //         setError("root", { type: "server", message: authError.message || "The database is currently unreachable." });
    //         throw new Error(authError.message || "Database is offline.");
    //       }
    //       else if (authError.status === 422 || authError.message?.toLowerCase().includes("exists")) {
    //         setError("email", { type: "server", message: "This email is already in use." });
    //       } else {
    //         setError("root", { type: "server", message: "Database connection failed." });
    //       }
    //       setIsLockdown(false);
    //       // 2. Reject the promise so sonner knows it failed, passing along the error message
    //       throw new Error(authError.message || "new account Creation failed.");
    //     }

    //     // 3. Resolve the promise on success
    //     ModalStateFunction(false);
    //     return data
    //   } catch (err) { throw new Error(err) }
    // };

    // await toast.promise(AdminCreateUserAction(), {
    //   loading: "Creating user account...",
    //   success: () => {
    //     // should redirect to users list for the admin
    //     const message = "Account created successfully! Welcome 🎉 Redirecting ..."
    //     return successToast(message)
    //   },
    //   error: (err) => {
    //     // return errorToast(err)
    //     return `${err.message}`
    //   },
    // });