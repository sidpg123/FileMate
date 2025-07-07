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
    setClientId: (clientId: string) => void;
    setName: (name: string) => void;
    setEmail: (email: string) => void;
    setPhone: (phone: string) => void;
    setPendingFees: (pendingFees: number) => void;
}

// interface accessTokenStore {
//     accessToken: string;
//     setAccessToken: (accessToken: string) => void;
// }

// export const useAccessTokenStore = create<accessTokenStore>((set) => ({
//     accessToken: '',
//     setAccessToken: (accessToken: string) => set(() => ({ accessToken })),
// }));


export const useRoleStore = create<roleStore>((set) => ({
    role: '',
    setRole: (role: string) => set(() => ({ role })),
}));

export const useCurrentClient = create<currentClientStore>((set) => ({
    clientId: '',
    name: '',
    email: '',
    phone: '', 
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