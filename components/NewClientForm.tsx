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
    const queryClient = useQueryClient()

    const form = useForm<NewClientFormSchemaType>({
        resolver: zodResolver(NewClientFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    })

    const setOpenNewUserDialog = useNewUserFormStore(
        (state) => state.setOpenNewUserDialog
    )

    const { mutate, isPending } = useMutation({
        mutationFn: createClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] })
            queryClient.invalidateQueries({ queryKey: ['userInfo'] })

            toast.success("Client created successfully")

            form.reset()
            setOpenNewUserDialog(false)
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(
                    error.response?.data.message || "Failed to create client"
                )
            } else {
                toast.error("Something went wrong")
            }
        }
    })

    function onSubmit(values: NewClientFormSchemaType) {
        if (isPending) return
        mutate({ data: values })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 px-1 w-full max-w-md mx-auto"
            >
                {/* Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    autoFocus
                                    placeholder="John Doe"
                                    autoComplete="name"
                                    disabled={isPending}
                                    className="h-11"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Client display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="john@gmail.com"
                                    autoComplete="email"
                                    disabled={isPending}
                                    className="h-11"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Phone */}
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input
                                    type="tel"
                                    placeholder="1234567890"
                                    autoComplete="tel"
                                    maxLength={10}
                                    disabled={isPending}
                                    className="h-11"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-11 mt-2"
                >
                    {isPending ? "Creating Client..." : "Create Client"}
                </Button>
            </form>
        </Form>
    )
}
