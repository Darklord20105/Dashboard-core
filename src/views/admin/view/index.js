'use client'

// React Imports
import { useState } from 'react'

// Component Imports
import { AddEditUserSheet } from './dialogs/add-edit-user-sheet'
import { UserViewLeftPanel } from './user-view-left-panel'
import { UserViewTabs } from './user-view-tabs'

// Third-party Imports
import { toast } from 'sonner'
import { successToast, errorToast } from "@/src/components/ui/sonner";

// Actions
import { adminUpdateUserDataAction } from '@/src/app/(pages)/admin/admin-view-user/[id]/actions'


const UserViewApp = ({ initialUser }) => {
  if (initialUser.error) {
    return <span>{initialUser.error}</span>
  }
  // console.log(initialUser)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const { user } = initialUser;

  const handleUpdateUserData = async (id, data) => {
    console.log(id, data)
    let bannedState = false
    if (data.status === "active") {
      bannedState = false
    } else {
      bannedState = true
    }

    const adminUpdateUserDataPromise = async () => {
      try{
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

      } catch(error) {
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


  return (
    <>
      <div className='relative grid grid-cols-1 gap-6 lg:grid-cols-[350px_minmax(0,1fr)]'>
        <UserViewLeftPanel user={user} onEdit={() => setIsEditSheetOpen(true)} />
        <UserViewTabs user={user} />
      </div>

      <AddEditUserSheet
        mode={isEditSheetOpen ? 'edit' : null}
        user={user}
        onClose={() => setIsEditSheetOpen(false)}
        onAdd={() => {}}
        onEdit={handleUpdateUserData}
        formStateFunction={setIsEditSheetOpen}
      />
    </>
  )
}

export default UserViewApp
