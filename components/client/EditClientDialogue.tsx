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

function EditClientDialog() {

    return (
        <Dialog>
            <DialogTrigger asChild >
                <Button onClick={() => {
                    ;
                }} className="w-full sm:w-1/6 mt-3 sm:mt-0 bg-[#4A72FF] hover:bg-blue-500 shadow-md shadow-blue-500">
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