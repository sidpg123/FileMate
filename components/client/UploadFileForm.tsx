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
            toast.success("Uploading...");
        },
        onError: () => {
            toast.error("Failed to get upload URL");
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
            toast.success("Successfully uploaded.");

        },
        onError: () => {
            toast.error("Failed to upload.");
        }
    });

    const uploadFileMetaDataMutation = useMutation({
        mutationFn: uploadDocMetaData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] })
        },
        onError: () => {
            toast.error("Error happened while updating file info.");
        }
    })

     
    async function onSubmit(values: UploadFileFormSchemaType) {
        try {
            if (!values.file) {
                toast.error("No file selected");
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
            });

            // Step 2: Upload to S3
            await uploadToS3Mutation.mutateAsync({
                uploadUrl: data.url,
                file: values.file
            });

            // Step : update DB
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
            toast.error("Upload failed");
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
            // 'text/plain': ['.txt'],
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
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                                <Input placeholder="2024-25" {...field} />
                            </FormControl>
                            <FormDescription>
                                Which year file is this?
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>File</FormLabel>
                            <FormControl>
                                <div>

                                    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 rounded-md">

                                        <Input
                                            {...getInputProps()}
                                            // className="hidden"
                                            id="file"
                                            placeholder="file"
                                            type="file"
                                        />
                                        {isDragActive ? (
                                            <p className="text-gray-500">Drop the file here...</p>
                                        ) : (
                                            <p className="text-gray-500">Drag 'n' drop a file here, or click to select one</p>
                                        )}


                                    </div>
                                    {field.value && field.value.name ? (
                                        <p className="mt-2 text-sm text-gray-600">Selected file: {field.value.name}</p>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </FormControl>
                            <FormDescription>
                                This is the file you want to upload.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
