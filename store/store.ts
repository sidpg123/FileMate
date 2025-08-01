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

interface CurrentFileStore {
    year: string;
    name: string;
    key: string;
    fileId: string;
    openUpdateFileDialog: boolean;
    openDeleteFileDialog: boolean;
    openFileMenuDropdown: boolean;
    setFileId: (fileId: string) => void;
    setKey: (key: string) => void;
    setYear: (year: string) => void;
    setName: (name: string) => void;
    setOpenFileMenuDropdown: (openMenu: boolean) => void;
    setOpenUpdateFileDialog: (open: boolean) => void;
    setOpenDeleteFileDialog: (open: boolean) => void;
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

export const useCurrentFileStore = create<CurrentFileStore>((set) => ({
    year: '',
    name: '',
    key: '',
    fileId: '',
    openUpdateFileDialog: false,
    openDeleteFileDialog: false,
    openFileMenuDropdown: false,
    setFileId(fileId) {
        set(() => ({ fileId}));
    },
    setKey(key) {
        set(() => ({ key }));
    },
    setName(name) {
        set(() => ({ name }));
    },
    setYear(year) {
        set(() => ({ year }));
    },
    setOpenUpdateFileDialog(open) {
        set(() => ({ openUpdateFileDialog: open }));
    },
    setOpenDeleteFileDialog(open) {
        set(() => ({ openDeleteFileDialog: open }));
    },
    setOpenFileMenuDropdown(open) {
        set(() => ({ openFileMenuDropdown: open }));
    },
}));