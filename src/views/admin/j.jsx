// https://shadcnstudio.com/docs/components/dialog?base=base
import { useState } from 'react';

// Third-party Imports
import { Trash2Icon, TriangleAlertIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from "@/index"
import { toast } from 'sonner'
import api from '@/lib/api'
import { delay } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
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

export default function DeleteDialog({ id }) {
    const [open, setOpen] = useState(false)

    // const deleteDebtMutation = useMutation({
    //     mutationFn: async () => {
    //         await delay(5000)
    //         await api.delete(
    //             `/api/users/del-debt/${id}`,
    //         )
    //     },
    //     onSuccess: () => {
    //         toast.success('debt has been deleted successfully');

    //         queryClient.invalidateQueries({
    //             queryKey: ['debt-list']
    //         })
    //         setOpen(false)

    //     },
    //     onError: (err) => {
    //         toast.error(
    //             err.response?.data?.message || 'Failed to delete debt... something is wrong'
    //         );

    //         console.error(err)
    //     }
    // })

    const handleDelete = () => {
        // deleteDebtMutation.mutate(debt.id)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant='ghost' />}>
                <Trash2Icon />
                {/* <span className='max-lg:hidden'>Delete Debt</span> */}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader className='place-items-center! items-center'>
                    <div className='bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full'>
                        <TriangleAlertIcon className='text-destructive size-6' />
                    </div>

                    <DialogTitle>Are you absolutely sure you want to delete?</DialogTitle>
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
                    <Button 
                    onClick={handleDelete}
                    // disabled={deleteDebtMutation.isPending} 
                    variant='destructive'>
                        {/* {deleteDebtMutation.isPending ? 'Processing ...': 'Delete'} */}
                        delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
