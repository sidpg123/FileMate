"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"

import { useCurrentClient } from "@/store/store"
import { Button } from "../ui/button"
import { EditClientForm } from "./EditClientForm"
import { useEffect } from "react"

function EditClientDialog() {
    const setEditClientDialogOpen = useCurrentClient((state) => state.setEditClientDialogOpen)
    const open = useCurrentClient((state) => state.openEditClientDialog)
    useEffect(() => {
        setEditClientDialogOpen(false) // Ensure dialog is closed initially
    }, [setEditClientDialogOpen]);
    return (
        <Dialog open={open} onOpenChange={setEditClientDialogOpen}>
            <DialogTrigger asChild >
                <Button onClick={() => {
                    setEditClientDialogOpen(true);
                }} className="w-full md:w-1/6 mt-3 sm:mt-0 bg-[#d1d8f0] hover:bg-blue-500 shadow-md shadow-gray-400 text-black hover:text-white font-semibold tracking-wider">
                    Edit Client
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Client Information</DialogTitle>
                    <EditClientForm />

                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default EditClientDialog