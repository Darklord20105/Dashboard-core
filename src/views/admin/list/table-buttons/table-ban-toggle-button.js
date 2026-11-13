'use client'
import { useState } from 'react';

// Third party
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // or react-hot-toast
import { BanIcon, ShieldCheckIcon, TriangleAlertIcon } from "lucide-react";

// Util Imports
import { cn } from '@/lib/utils'

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

// Actions
import { banUserAction, unbanUserAction } from "@/app/(pages)/admin/admin-list-user/actions"; // Adjust path

export function ManageBanDialog({ user }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient();
  const isBanned = user.banned === true; // Check Better Auth's native flag

  const handleToggleBan = () => {
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
        queryClient.invalidateQueries({ queryKey: [`users-view-${user.id}`] });

      } catch (err) {
        throw new Error(err);
      }
    };

    toast.promise(banPromise, {
      loading: "Synchronizing account access status flags in MongoDB...",
      success: () => isBanned ? `Account has been been Activated` : "Account has been been Banned",
      error: (err) => `Status Change Failed: ${err.message}`
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
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
          </Button>
        }>

      </DialogTrigger>
      <DialogContent>
      <DialogHeader className='place-items-center! items-center'>
        <div className={`${isBanned ? 'bg-green-400/10' : 'bg-destructive/10'} mx-auto mb-2 flex size-12 items-center justify-center rounded-full`}>
          {isBanned ? <ShieldCheckIcon className='text-green-400 size-6' /> : <TriangleAlertIcon className='text-destructive size-6' />}
        </div>

        <DialogTitle>Are you absolutely sure you want to {isBanned ? "Activate" : "Suspend"} account?</DialogTitle>
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
        <Button onClick={handleToggleBan} className={`${isBanned ? 'bg-green-400/10 text-green-400' : 'bg-destructive/10 text-destructive'}`}>
          {isBanned ? "Activate" : "Suspend"}
        </Button>
      </DialogFooter>
    </DialogContent>
    </Dialog>
  )
}

export function TableBanToggleDropdown({ user }) {
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
        queryClient.invalidateQueries({ queryKey: [`users-view-${user.id}`] });

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

  return (
    <DropdownMenuItem
      onClick={handleToggleBan}
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