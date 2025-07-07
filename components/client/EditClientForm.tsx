"use client"

import { editClientById } from "@/lib/api/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCurrentClient } from "@/store/store"
import { useSession } from "next-auth/react"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
})

export function EditClientForm() {
    const session = useSession();

    const name = useCurrentClient((state) => state.name);
    const email = useCurrentClient((state) => state.email);
    const phone = useCurrentClient((state) => state.phone);
    // const accessToken = useAccessTokenStore((state) => state.accessToken);
    const clientId = useCurrentClient((state) => state.clientId);

    const queryClient = useQueryClient();



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name,
            email,
            phone: phone ?? "",
        },
    })

    const { mutate, status, error } = useMutation({
        mutationFn: editClientById,
        onSuccess: (data) => {
            console.log("Client updated successfully:", data)
            toast.success("Client updated successfully")
            // Update the current client state with the new data
            useCurrentClient.setState({
                name: data.name,
                email: data.email,
                phone: data.phone,
                clientId: data.clientId, // Ensure clientId is also updated
            })

            // queryClient.setQueryData(['client', clientId], data)
            queryClient.invalidateQueries({ queryKey: ['client', clientId] }) // Invalidate the query to refetch the updated client data

        },
        onError: (error) => {
            console.error("Error updating client:", error)
            // @ts-ignore
            toast.error(`Error: ${error.response?.data?.message || error.message}`, {
                duration: 5000,
            })
        }

    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("accesstoken", session.data?.accessToken);
        mutate({
            clientId: clientId, // Replace this
            data: values,
            accessToken: `${session.data?.accessToken}`,
        })
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
                                <Input placeholder="name" {...field} />
                            </FormControl>
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
                                <Input placeholder="email" {...field} />
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
                                <Input placeholder="phone" {...field} />
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
