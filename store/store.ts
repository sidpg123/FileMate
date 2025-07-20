import { set } from 'zod';
import { create } from 'zustand'

interface roleStore {
    role: string;
    setRole: (role: string) => void;
}

interface currentClientStore {
    clientId: string;
    name: string;
    email: string;
    phone?: string;
    pendingFees?: number;
    openEditClientDialog?: boolean;
    setEditClientDialogOpen: (open: boolean) => void;
    setClientId: (clientId: string) => void;
    setName: (name: string) => void;
    setEmail: (email: string) => void;
    setPhone: (phone: string) => void;
    setPendingFees: (pendingFees: number) => void;
}

interface newUserFormStore {
    name: string;
    email: string;
    phone?: string;
    openNewUserDialog?: boolean;
    setOpenNewUserDialog: (open: boolean) => void;
    setName: (name: string) => void;
    setEmail: (email: string) => void;
    setPhone: (phone: string) => void;
}

interface uploadDocStore {
    year: string;
    openUploadDocDialog: boolean;
    setYear: (year: string) => void;
    setOpenUploadDocDialog: (open: boolean) => void;
}

interface UserDetails {
    id: string;
    name: string;
    email: string;
    setId: (id: string) => void;
    setName: (name: string) => void;
    setEmail: (email: string) => void;
}

export const useUserDetailsStore = create<UserDetails>((set) => ({
    id: '',
    email: '',
    name: '',
    setId(id) {
        set(() => ({ id }))
    },
    setEmail(email) {
        set(() => ({ email }))
    },
    setName(name) {
        set(() => ({ name }))
    },
}))

export const useNewUserFormStore = create<newUserFormStore>((set) => ({
    name: '',
    email: '',
    phone: '',
    openNewUserDialog: false,
    setOpenNewUserDialog(open) {
        set(() => ({ openNewUserDialog: open }))
    },
    setName(name) {
        set(() => ({ name }))
    },
    setEmail(email) {
        set(() => ({ email }))
    },
    setPhone(phone) {
        set(() => ({ phone }))
    },
}));


export const useRoleStore = create<roleStore>((set) => ({
    role: '',
    setRole: (role: string) => set(() => ({ role })),
}));

export const useCurrentClient = create<currentClientStore>((set) => ({
    clientId: '',
    name: '',
    email: '',
    phone: '',
    openEditClientDialog: false,
    setEditClientDialogOpen(open) {
        set(() => ({ openEditClientDialog: open }))
    },
    setClientId(clientId) {
        set(() => ({ clientId }))
    },
    setName(name) {
        set(() => ({ name }))
    },
    setEmail(email) {
        set(() => ({ email }))
    },
    setPhone(phone) {
        set(() => ({ phone }))
    },
    setPendingFees(pendingFees) {
        set(() => ({ pendingFees }))
    },
}));