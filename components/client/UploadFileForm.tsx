"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { uploadDocMetaData } from "@/lib/api/client";
import { getUploadUrl } from "@/lib/api/s3";
import { useCurrentClient } from "@/store/store";
import { UploadFileFormSchema, UploadFileFormSchemaType } from "@/zodSchem/cleint.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidV4 } from "uuid";
import { Upload, FileText, Calendar, CheckCircle2, Loader2, X } from "lucide-react";

export default function UploadFileForm() {
    const clientId = useCurrentClient((state) => state.clientId);
    const session = useSession();
    const queryClient = useQueryClient();
    const userId = session.data?.user.id;

    const form = useForm<UploadFileFormSchemaType>({
        resolver: zodResolver(UploadFileFormSchema),
        defaultValues: {
            file: new File([], ""), // Placeholder for file input
            year: "",
        },
    })

    const getUploadUrlMutation = useMutation({
        mutationFn: getUploadUrl,
        onSuccess: (data) => {
            toast.info("Preparing upload...", { duration: 1000 });
        },
        onError: () => {
            toast.error("Failed to prepare upload");
        }
    })

    const uploadToS3Mutation = useMutation({
        mutationFn: async ({ uploadUrl, file }: { uploadUrl: string; file: File }) => {
            await fetch(uploadUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": file.type,
                },
                body: file,
            });
        },
        onSuccess: () => {
            toast.success("File uploaded successfully!");
        },
        onError: () => {
            toast.error("Failed to upload file");
        }
    });

    const uploadFileMetaDataMutation = useMutation({
        mutationFn: uploadDocMetaData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            queryClient.invalidateQueries({ queryKey: ["client"]});
            toast.success("Document added to client files!");
        },
        onError: () => {
            toast.error("Failed to save document information");
        }
    })

    const isUploading = getUploadUrlMutation.isPending || uploadToS3Mutation.isPending || uploadFileMetaDataMutation.isPending;
    
    async function onSubmit(values: UploadFileFormSchemaType) {
        try {
            if (!values.file) {
                toast.error("Please select a file to upload");
                return;
            }
            const uuid = uuidV4();
            const originalFileName = values.file.name;
            const fileExt = originalFileName.split(".").pop()?.toLowerCase();
            console.log("contentType", values.file.type);

            const key = `users/${userId}/${clientId}/${values.year}/${uuid}.${fileExt}`;

            // Step 1: Get Upload URL from backend
            const { data } = await getUploadUrlMutation.mutateAsync({
                key,
                contentType: values.file.type,
                fileSize: values.file.size
            });

            // Step 2: Upload to S3
            await uploadToS3Mutation.mutateAsync({
                uploadUrl: data.url,
                file: values.file
            });

            // Step 3: update DB
            await uploadFileMetaDataMutation.mutateAsync({
                data: {
                    clientId,
                    fileKey: key,
                    fileName: originalFileName,
                    fileSize: values.file.size,
                    thumbnailKey: fileExt == 'pdf' ? `users/${userId}/${clientId}/${values.year}/${uuid}-thumb.jpg` : 'public/default.jpg',
                    year: values.year
                }
            })        

            form.reset();
        } catch (err) {
            console.log((err as any).response.data.error);
            toast.error((err as any).response.data.error || "An error occurred during upload");
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                form.setValue("file", acceptedFiles[0]);
            }
        },
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': [],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx', '.xls'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
            'application/vnd.ms-powerpoint': ['.ppt'],
            'application/zip': ['.zip'],
            'application/x-rar-compressed': ['.rar'],
            'application/json': ['.json'],
            'application/xml': ['.xml'],
        },
        maxFiles: 1,
        disabled: isUploading
    });

    const selectedFile = form.watch("file");
    const hasSelectedFile = selectedFile && selectedFile.name;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Year Input */}
                <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                Financial Year
                            </FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="e.g., 2024-25" 
                                    {...field} 
                                    className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                />
                            </FormControl>
                            <FormDescription className="text-gray-500">
                                Enter the financial year this document belongs to
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* File Upload */}
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <FileText className="w-4 h-4 text-blue-500" />
                                Document File
                            </FormLabel>
                            <FormControl>
                                <div className="space-y-4">
                                    {/* Dropzone */}
                                    <div 
                                        {...getRootProps()} 
                                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                                            isDragActive 
                                                ? 'border-blue-400 bg-blue-50' 
                                                : hasSelectedFile
                                                    ? 'border-green-400 bg-green-50'
                                                    : 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-25'
                                        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <Input
                                            {...getInputProps()}
                                            className="hidden"
                                            id="file"
                                            type="file"
                                            disabled={isUploading}
                                        />
                                        
                                        <div className="space-y-4">
                                            {hasSelectedFile ? (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-semibold text-green-800">File Selected!</p>
                                                        <p className="text-sm text-green-600">Click to change or drag a new file</p>
                                                    </div>
                                                </div>
                                            ) : isDragActive ? (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Upload className="w-8 h-8 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-semibold text-blue-800">Drop your file here</p>
                                                        <p className="text-sm text-blue-600">Release to upload</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <Upload className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-semibold text-gray-700">
                                                            Drag & drop your file here
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            or <span className="text-blue-600 font-medium">click to browse</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Selected File Info */}
                                    {hasSelectedFile && (
                                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <FileText className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        form.setValue("file", new File([], ""));
                                                    }}
                                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                    disabled={isUploading}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormDescription className="text-gray-500">
                                Supported formats: PDF, Images, Word, Excel, PowerPoint, ZIP, and more (Max 50MB)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-100">
                    <Button 
                        type="submit" 
                        disabled={isUploading || !hasSelectedFile}
                        className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Upload Document
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}