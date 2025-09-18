"use client"
import { NewClientFormSchema, NewClientFormSchemaType } from '@/zodSchem/cleint.schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useNewUserFormStore } from '@/store/store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/api/client'
import { toast } from 'sonner'
import { AxiosError } from 'axios'



export default function NewClientForm() {
    const queryClient = useQueryClient();

    const form = useForm<NewClientFormSchemaType>({
        resolver: zodResolver(NewClientFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    })
    const setOpenNewUserDialog = useNewUserFormStore((state) => state.setOpenNewUserDialog)


    const { mutate } = useMutation({
        mutationFn: createClient,
        onSuccess: () => {
            //console.log("Client created successfully:", data)
            // You can handle success here, like showing a toast or updating state
            queryClient.invalidateQueries({ queryKey: ['clients'] }) // Invalidate the clients list query to refetch
            queryClient.invalidateQueries({ queryKey: ['userInfo'] }) // Invalidate the clients list query to refetch
            setOpenNewUserDialog(false) // Close the dialog after successful submission
            toast.success("Client created successfully");
        },
        onError: (error) => {
            // console.error("Error creating client:", error)
            if(error instanceof AxiosError){
                toast.error(error.response?.data.message || "Failed to create client")
            }
            // Handle error here, like showing an error message
        }
    })

    function onSubmit(values: NewClientFormSchemaType) {
        // mutate({
        //     data: values
        // }) // Call the mutation function with the form values
        mutate({data: values});
        // //console.log(values)
        

        // setOpenNewUserDialog(false) // Close the dialog after submission
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="johndeo@gmail.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input placeholder="+91 8080808080" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
