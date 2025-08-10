import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { deleteFee } from '@/lib/api/fees';

export default function DeleteFeesDialogue({ feeId, clientId }: { feeId: string, clientId: string }) {
    // Use local state instead of global state
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const { mutate, status } = useMutation({
        mutationFn: deleteFee,
        onMutate: () => {
            // Show loading toast when mutation starts
            toast.loading("Deleting fee...", {
                id: `delete-fee-${feeId}` // Use unique ID per fee
            });
        },
        onSuccess: () => {
            // Dismiss the loading toast and show success
            toast.dismiss(`delete-fee-${feeId}`);
            toast.success("Fee deleted successfully");
            // Invalidate the fees query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['fees', clientId] })
            queryClient.invalidateQueries({ queryKey: ['client'] })
            queryClient.invalidateQueries({ queryKey: ['clients'] })
            queryClient.invalidateQueries({ queryKey: ['userInfo'] })
            setOpen(false); // Close dialog on success
        },
        onError: (error) => {
            // Dismiss the loading toast and show error
            toast.dismiss(`delete-fee-${feeId}`);
            toast.error("Error deleting fee: " + error.message);
        }
    });

    const handleDelete = async () => {
        const deleteData = {
            clientId: clientId,
            feeId: feeId
        };

        //console.log("Deleting fee with data:", deleteData);
        mutate(deleteData);
    };

    const handleCancel = () => {
        // If there's an ongoing mutation, don't allow canceling
        if (status === 'pending') {
            return;
        }
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto hover:bg-red-50"
                >
                    <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm to delete fee record?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the fee record.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={status === 'pending'}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={status === 'pending'}
                    >
                        {status === 'pending' ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}