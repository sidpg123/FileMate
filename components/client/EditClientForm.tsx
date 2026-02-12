"use client"

import { editClientById } from "@/lib/api/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Alert, AlertDescription } from "@/components/ui/alert"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCurrentClient } from "@/store/store"
import { EditClientFormSchema, EditClientFormSchemaType } from "@/zodSchem/cleint.schemas"
import { AxiosError } from "axios"
import { Loader2 } from "lucide-react"

export function EditClientForm() {
    // const session = useSession();

    const name = useCurrentClient((state) => state.name);
    const email = useCurrentClient((state) => state.email);
    const phone = useCurrentClient((state) => state.phone);
    const status = useCurrentClient((state) => state.status);
    const clientId = useCurrentClient((state) => state.clientId);
    const setEditClientDialogOpen = useCurrentClient((state) => state.setEditClientDialogOpen);
    const queryClient = useQueryClient();

    const form = useForm<EditClientFormSchemaType>({
        resolver: zodResolver(EditClientFormSchema),
        defaultValues: {
            name,
            email,
            phone: phone ?? "",
            status: status || 'active',
        },
    })

    const { mutate, isPending, error } = useMutation({
        mutationFn: editClientById,
        onSuccess: (data) => {
            //console.log("Client updated successfully:", data)
            toast.success("Client updated successfully")
            
            queryClient.invalidateQueries({ queryKey: ['client', clientId] })
            queryClient.invalidateQueries({ queryKey: ['clients'] })
            useCurrentClient.setState({
                name: data.name,
                email: data.email,
                phone: data.phone,
                status: data.status,
                clientId: data.clientId,
            })
            setEditClientDialogOpen(false)
            // form.reset()
        },
        onError: (err) => {
             if (err instanceof AxiosError) {
                toast.error(err.response?.data?.error || "An error occurred during edit");
            } else {
                toast.error("An unknown error occurred");
            }
        }
    })

    function onSubmit(values: z.infer<typeof EditClientFormSchema>) {
        //console.log("accesstoken", session.data?.accessToken);
        if(isPending) return 
        mutate({
            clientId: clientId,
            data: values,
            // accessToken: `${session.data?.accessToken}`,
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error  && (
                    <Alert variant="destructive">
                        <AlertDescription>
{/* @ts-expect-error – error type from Axios can be unknown */}
                            {error.response?.data?.message || error.message || "An error occurred while updating the client"}
                        </AlertDescription>
                    </Alert>
                )}

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="Enter client name" 
                                    disabled={isPending}
                                    {...field} 
                                />
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
                                <Input 
                                    placeholder="Enter email address" 
                                    type="email"
                                    disabled={isPending}
                                    {...field} 
                                />
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
                                <Input 
                                    placeholder="Enter phone number" 
                                    disabled={isPending}
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                disabled={isPending}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select client status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-3 pt-4">
                    <Button 
                        type="submit" 
                        disabled={isPending}
                        className="flex-1"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update Client"
                        )}
                    </Button>
                    
                    <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setEditClientDialogOpen(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    )
}