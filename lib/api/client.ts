// import { useSession } from "next-auth/react";
import { access } from "fs";
import { axiosClient, axiosInstance } from "../utils";

export const fetchClients = async ({
    pageParam,
    search,
    status,
    feeStatus,
    sortBy,
    sortOrder,
    accessToken
}: {
    pageParam?: { createdAt: string; id: string } | null;
    search?: string;
    status?: string;
    feeStatus?: string;
    sortBy?: string;
    sortOrder?: string;
    accessToken: string;
}) => {
    console.log("sending Request to backend")
    // const session =  useSession();
    // console.log("Will it print?");
    // console.log("session: ",session)
    let count = 0;
    if(search) count++;
    console.log("count of search", count);
    console.log("search is: ", search);
    const res = await axiosInstance.get(`/clients`, {
        params: {
            cursorCreatedAt: pageParam?.createdAt,
            cursorId: pageParam?.id,
            search,
            status,
            feeStatus,
            sortBy,
            sortOrder,
        },
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return res.data;

}

export const fetchClientById = async ({
    clientId,
    // accessToken
}: {
    clientId: string;
    // accessToken: string;
}) => {
    const res = await axiosClient.get(`/clients/${clientId}`);
    // console.log("fetchClientById response: ", res.data);
    return res.data;
}

export const editClientById = async ({
    clientId,
    data,
    accessToken
}: {
    clientId: string;
    data: {
        name?: string;
        email?: string;
        phone?: string;
    };
    accessToken: string;
}) => {
    const res = await axiosClient.put(`/clients/${clientId}`, data);
    console.log("editClientById response: ", res.data);
    return res.data;
}