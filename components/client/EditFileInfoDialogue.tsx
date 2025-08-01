import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCurrentFileStore } from '@/store/store'

export default function DeleteFileDialogue() {
    const open = useCurrentFileStore((state) => state.openUpdateFileDialog  );
    const setOpenUpdateFileDialog = useCurrentFileStore((state) => state.setOpenUpdateFileDialog);
    
    const handleDelete = () => {
        // Add your delete logic here
        console.log('File deleted');
        setOpenUpdateFileDialog(false);
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpenUpdateFileDialog}>
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
                        onClick={() => setOpenUpdateFileDialog(false)}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}