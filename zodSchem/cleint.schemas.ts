import { z } from "zod";

 export const EditClientFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
})

export type EditClientFormSchemaType = z.infer<typeof EditClientFormSchema>;

export const NewClientFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type NewClientFormSchemaType = z.infer<typeof NewClientFormSchema>; 

export const UploadFileFormSchema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => file.size > 0, "File is required"),
    year: z.string().nonempty("Please enter year")
});

export type UploadFileFormSchemaType = z.infer<typeof UploadFileFormSchema>;