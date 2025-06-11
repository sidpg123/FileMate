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

function NewClientDialog() {

    return (
        <Dialog>
            <DialogTrigger asChild >
                <Button onClick={() => {;
                }} className="hidden md:block bg-[#4A72FF] hover:bg-blue-500 shadow-lg shadow-blue-500">
                    New Client +
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default NewClientDialog