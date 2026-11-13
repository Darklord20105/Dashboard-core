'use client'
import { useState } from 'react';
// Third party
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // or react-hot-toast
import { Trash2Icon } from "lucide-react"; // Nice clean trashcan icon

// components
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'

import { deleteUserAction } from "@/app/(pages)/admin/admin-list-user/actions"; // Adjust path to actions file

export function ManageDeleteDialog({ user }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient();

  const handleDeleteClick = async () => {
    // 🌟 Create a tracked Promise execution to drive your toast system
    const deletePromise = async () => {
      try {
        const response = await deleteUserAction(user.id);

        if (response && !response.success) {
          throw new Error(response.error);
        }
        queryClient.invalidateQueries({ queryKey: ['users-list'] });
      } catch (err) {
        throw new Error(err)
      }
    };

    // Fire loading, success, and error alerts dynamically!
    toast.promise(deletePromise, {
      loading: "Purging account document from MongoDB database rows...",
      success: () => `Account has been Successfull Deleted`,
      error: (err) => `Purge Failed: ${err.message}`
    });

  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant='ghost'
            className="p-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            title="Delete Account Profile"
          >
            <Trash2Icon className="size-4.5" style={{ width: '18px', height: '18px' }} />
          </Button>
        }>

      </DialogTrigger>
      <DialogContent>
        <DialogHeader className='place-items-center! items-center'>

          <div className={`bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full`}>
            <Trash2Icon className="size-4.5 text-destructive" style={{ width: '18px', height: '18px' }} />
          </div>

          <DialogTitle>Are you absolutely sure you want to Delete this account?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            <span className='mt-4 flex items-center justify-center gap-3'>
              <Checkbox id='terms' />
              <Label htmlFor='terms'>Don&apos;t ask next again</Label>
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button onClick={handleDeleteClick} className={`bg-destructive/10 text-destructive`}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function TableDeleteDropdown({ user }) {
  const queryClient = useQueryClient();

  const handleDeleteClick = async () => {
    // Standard visual confirmation barrier to avoid accidental row deletions
    const confirmDelete = window.confirm(`Are you absolutely sure you want to permanently delete the profile account for ${user.name || 'this user'}?`);
    if (!confirmDelete) return;

    // 🌟 Create a tracked Promise execution to drive your toast system
    const deletePromise = async () => {
      try {
        const response = await deleteUserAction(user.id);

        if (response && !response.success) {
          throw new Error(response.error);
        }
        queryClient.invalidateQueries({ queryKey: ['users-list'] });
      } catch (err) {
        throw new Error(err)
      }
    };

    // Fire loading, success, and error alerts dynamically!
    toast.promise(deletePromise, {
      loading: "Purging account document from MongoDB database rows...",
      success: () => `Account has been Successfull Deleted`,
      error: (err) => `Purge Failed: ${err.message}`
    });

  };

  return (
    <DropdownMenuItem
      variant="destructive"
      onClick={handleDeleteClick}
      // disabled={isPending}
      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
      style={{ cursor: "pointer" }}
      title="Delete Account Profile"
    >
      <Trash2Icon className="size-4.5" style={{ width: '18px', height: '18px' }} />
      <span>Delete User</span>
    </DropdownMenuItem>
  )
}
