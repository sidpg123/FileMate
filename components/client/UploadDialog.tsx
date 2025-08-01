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
import { Upload, Plus } from "lucide-react";

export default function UploadDialog() {
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-6 py-3 font-semibold flex items-center gap-2 min-w-fit">
                        <Plus className="w-4 h-4" />
                        Upload Document
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="space-y-3 pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <Upload className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-gray-900">
                                    Upload New Document
                                </DialogTitle>
                                <DialogDescription className="text-gray-600 text-base mt-1">
                                    Add a new document to your client's file collection. Supported formats include PDF, images, Word documents, Excel sheets, and more.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="pt-6">
                        <UploadFileForm />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}