"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import React from 'react'
import { Button } from "./ui/button"
import NewClientForm from "./NewClientForm"
import { useNewUserFormStore } from "@/store/store"

function NewClientDialog() {
    const openNewUserDialog = useNewUserFormStore((state) => state.openNewUserDialog)
    const setOpenNewUserDialog = useNewUserFormStore((state) => state.setOpenNewUserDialog)
    return (
        <Dialog open={openNewUserDialog} onOpenChange={setOpenNewUserDialog}>
            <DialogTrigger asChild >
                <Button onClick={() => {;
                }} className=" bg-[#4A72FF] hover:bg-blue-500 shadow-lg shadow-blue-500">
                    New Client +
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Client Form</DialogTitle>
                    <DialogDescription>
                        Add details of the new client here. You can add more details later.
                    </DialogDescription>
                </DialogHeader>
                <NewClientForm />
            </DialogContent>
        </Dialog>
    )
}

export default NewClientDialog