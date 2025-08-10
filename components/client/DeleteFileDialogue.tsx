import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCurrentClient, useCurrentFileStore } from '@/store/store'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFile } from '@/lib/api/s3';
import { toast } from 'sonner';

export default function DeleteFileDialogue() {
    const open = useCurrentFileStore((state) => state.openDeleteFileDialog);
    const setOpenDeleteFileDialog = useCurrentFileStore((state) => state.setOpenDeleteFileDialog);
    const queryClient = useQueryClient();

    const { mutate, status } = useMutation({
        mutationFn: deleteFile,
        onMutate: () => {
            // Show loading toast when mutation starts
            toast.loading("Deleting file...", {
                id: 'delete-file' // Use a specific ID to control this toast
            });
        },
        onSuccess: () => {
            // Dismiss the loading toast and show success
            toast.dismiss('delete-file');
            toast.success("File deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({queryKey: ['client']})
            setOpenDeleteFileDialog(false); // Close dialog on success
        },
        onError: (error) => {
            // Dismiss the loading toast and show error
            toast.dismiss('delete-file');
            toast.error("Error deleting file: " + error.message);
        }
    });

    const handleDelete = async () => {
        const deleteData = {
            clientId: useCurrentClient.getState().clientId,
            key: useCurrentFileStore.getState().key,
            fileId: useCurrentFileStore.getState().fileId
        };

        //console.log("Deleting file with data:", deleteData);

        // Using the callback approach (recommended)
        mutate(deleteData);
    };

    const handleCancel = () => {
        // If there's an ongoing mutation, don't allow canceling
        if (status === 'pending') {
            return;
        }
        setOpenDeleteFileDialog(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpenDeleteFileDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm to delete file?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the file.
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