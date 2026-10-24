'use client'
// Third party
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // or react-hot-toast
import { BanIcon, ShieldCheckIcon } from "lucide-react";

// Util Imports
import { cn } from '@/src/lib/utils'

// components
import { Button } from "@/src/components/ui/button";
import { DropdownMenuItem } from "@/src/components/ui/dropdown-menu";

// Actions
import { banUserAction, unbanUserAction } from "@/src/app/(pages)/admin/admin-list-user/actions"; // Adjust path


export default function TableBanToggleButton({ user, isButton = false }) {
  const queryClient = useQueryClient();
  const isBanned = user.banned === true; // Check Better Auth's native flag

  const handleToggleBan = () => {
    const actionText = isBanned ? "Activate" : "Suspend";
    const confirmAction = window.confirm(`Are you sure you want to ${actionText} the account for ${user.name || 'this user'}?`);
    if (!confirmAction) return;

    const banPromise = async () => {
      try {
        // Dynamic execution branch based on current database state flags
        const response = isBanned
          ? await unbanUserAction(user.id)
          : await banUserAction(user.id, "Administrative suspension override");

        if (response && !response.success) {
          throw new Error(response.error);
        }
        queryClient.invalidateQueries({ queryKey: ['users-list'] });
      } catch (err) {
        throw new Error(err);
      }
    };

    toast.promise(banPromise, {
      loading: "Synchronizing account access status flags in MongoDB...",
      success: () => isBanned ? `Account has been been Activated` : "Account has been been Banned",
      error: (err) => `Status Change Failed: ${err.message}`
    });

  };

  if (isButton) {
    return (
      <Button
        onClick={handleToggleBan}
        variant='outline'
        title={isBanned ? "Activate Account" : "Suspend Account"}
        className={cn("sm:flex-1",
          isBanned
            ? "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-600" // Unban style
            : "text-destructive hover:bg-destructive/10 hover:text-destructive"     // Ban style
        )}
      >
        {isBanned ? (
          <>
            <ShieldCheckIcon className="size-4.5" style={{ width: '18px', height: '18px' }} />
            <span>Activate</span>
          </>
        ) : (
          <>
            <BanIcon className="size-4.5" style={{ width: '18px', height: '18px' }} />
            <span>Suspend</span>
          </>
        )}
      </Button>)
  }

  return (
    <DropdownMenuItem
      onClick={handleToggleBan}
      // disabled={isPending}
      className={cn(
        "p-1.5 rounded transition-colors disabled:opacity-40",
        isBanned
          ? "text-emerald-600 hover:bg-emerald-50" // Unban style
          : "text-amber-600 hover:bg-amber-50"     // Ban style
      )}
      style={{ cursor: "pointer" }}
      title={isBanned ? "Lift Account Suspension" : "Suspend Account"}
    >
      {isBanned ? (
        <>
          <ShieldCheckIcon className="size-4.5" style={{ width: '18px', height: '18px' }} />
          <span>Activate</span>
        </>
      ) : (
        <>
          <BanIcon className="size-4.5" style={{ width: '18px', height: '18px' }} />
          <span>Suspend</span>
        </>
      )}
    </DropdownMenuItem>
  );
}
