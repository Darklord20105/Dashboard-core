'use client'

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // or react-hot-toast
import { Trash2Icon } from "lucide-react"; // Nice clean trashcan icon

// components
import { DropdownMenuItem } from "@/src/components/ui/dropdown-menu";

// Actions
import { deleteUserAction } from "@/src/app/(pages)/admin/admin-list-user/actions"; // Adjust path to actions file

export default function TableDeleteButton({ user, isDropDown = false }) {
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

  if (isDropDown) {
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

  return (
    <button
      type="button"
      onClick={handleDeleteClick}
      // disabled={isPending}
      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
      // style={{ cursor: isPending ? "not-allowed" : "pointer" }}
      style={{ cursor:"pointer" }}
      title="Delete Account Profile"
    >
      <Trash2Icon className="size-4.5" style={{ width: '18px', height: '18px' }} />
    </button>
  );
}
