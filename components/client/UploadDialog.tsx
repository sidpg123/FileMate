"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import UploadFileForm from "./UploadFileForm";



export default function UploadDialog() {
    return (
        <div>
            <Dialog>
                <DialogTrigger>
                    <div className="w-full p-2 rounded-md mt-3 sm:mt-0 bg-blue-500 text-white hover:bg-blue-600 text-wrap  shadow-lg shadow-blue-500">
                        Upload Document
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <UploadFileForm />  
                </DialogContent>
            </Dialog>
        </div>
        
    )
}
