'use client'

// React Imports
import { useState, useEffect } from 'react'

// Component Imports
import { AddEditUserSheet } from './dialogs/add-edit-user-sheet'
import { UserViewLeftPanel } from './user-view-left-panel'
import { UserViewTabs } from './user-view-tabs'

// Third-party Imports
import { toast } from 'sonner'
import { successToast, errorToast } from "@/components/ui/sonner";
import { TableLoader } from "@/components/shared/TableState/TableLoader"
import { TableError } from '@/components/shared/TableState/TableError'

// Actions
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client"
import { adminUpdateUserDataAction } from '@/app/(pages)/admin/admin-view-user/[id]/actions'


const UserViewApp = ({ id }) => {
  const {
    data: user,
    error,
    refetch,
    isLoading,    // True ONLY on the very first mount with no data
    isRefetching, // True ONLY during manual .refetch() calls
    isFetching    // True during ANY network request (initial + updates)
  } = useQuery({
    queryKey: [`users-view-${id}`],
    queryFn: async () => {
      // await delay(2000)  // to test loaders
      const response = await authClient.admin.getUser({
        query: { id: id }
      })

      if (response.error) {
        throw new Error(response.error || 'Failed to fetch users');
      }

      return response.data;
    },
    structuralSharing: false, // to force refetch even if data is the same

  });


  console.log(user, 'user aata ' + id);
  console.log(error, 'error user aata');

  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleUpdateUserData = async (id, data) => {
    console.log(id, data)
    let bannedState = false
    if (data.status === "active") {
      bannedState = false
    } else {
      bannedState = true
    }

    const adminUpdateUserDataPromise = async () => {
      try {
        const result = await adminUpdateUserDataAction({
          userId: id,
          name: data.name,
          role: data.role,
          banned: bannedState
        })

        // Check if the backend reported a validation or server restriction error
        if (result && !result.success) {
          // 🌟 Throwing the message forces toast to switch to the "error" style instantly
          throw new Error(result.error || "Failed to synchronize privileges.");
        }

        return (result?.message || "User Data update Success.");

      } catch (error) {
        throw new Error(error);
      }
    };

    await toast.promise(adminUpdateUserDataPromise(), {
      loading: "Synchronizing Database...",
      success: () => {
        const message = "user data update success!"
        return successToast(message)
      },
      error: (err) => {
        return errorToast(err.message)
      },
    });
  }

  if (!user) {
    return (<>Loading User ...</>)
  }

  return (
    <>
      {isFetching ? <TableLoader /> : (
        error ? <TableError error={error} refetch={refetch} /> : (
          <>
            <div className='relative grid grid-cols-1 gap-6 lg:grid-cols-[350px_minmax(0,1fr)]'>
              <UserViewLeftPanel user={user} onEdit={() => setIsEditSheetOpen(true)} />
              <UserViewTabs user={user} />
            </div>
            <AddEditUserSheet
              mode={isEditSheetOpen ? 'edit' : null}
              user={user}
              onClose={() => setIsEditSheetOpen(false)}
              onAdd={() => { }}
              onEdit={handleUpdateUserData}
              formStateFunction={setIsEditSheetOpen}
            />
          </>
        )
      )}


    </>
  )
}

export default UserViewApp
