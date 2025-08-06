// import { useSession } from "next-auth/react";
import { axiosClient } from "../utils";

export const fetchClients = async ({
    pageParam,
    search,
    status,
    feeStatus,
    sortBy,
    sortOrder,
}: {
    pageParam?: { createdAt: string; id: string } | null;
    search?: string;
    status?: string;
    feeStatus?: string;
    sortBy?: string;
    sortOrder?: string;
}) => {
    console.log("sending Request to backend")

    const res = await axiosClient.get(`/clients`, {
        params: {
            cursorCreatedAt: pageParam?.createdAt,
            cursorId: pageParam?.id,
            search,
            status,
            feeStatus,
            sortBy,
            sortOrder,
        }
    })
    return res.data;

}

export const fetchClientById = async ({
    clientId,
}: {
    clientId: string;
}) => {
    const res = await axiosClient.get(`/clients/${clientId}`);
    return res.data;
}

export const editClientById = async ({
    clientId,
    data,
}: {
    clientId: string;
    data: {
        name?: string;
        email?: string;
        phone?: string;
        status?: string; // active, inactive, archived
    };
    // accessToken: string;
}) => {
    const res = await axiosClient.put(`/clients/${clientId}`, data);
    console.log("editClientById response: ", res.data);
    return res.data;
}


export const createClient = async ({
    data,
}: {
    data: {
        name: string;
        email: string;
        phone?: string;
    };
}) => {
    const res = await axiosClient.post(`/clients`, data);

    console.log("createClient response: ", res.data);
    return res.data;
}

export const uploadDocMetaData = async ({
    data
}: {
    data: {
        clientId: string,
        fileName: string,
        fileKey: string,
        year: string,
        fileSize: number,
        thumbnailKey: string
    }
}) => {
    try {
        const res = await axiosClient.post(`clients/document`, data);
        console.log("response from uploadDocMetaData: ", res);     
    } catch (error) {
        console.error("Error occured while uploaing document metaData")
    }
    
}

export const fetchClientDocuments = async ({
    pageParam,
    search,
    clientId,
    year
} : {
    pageParam?: {uploadedAt: string; id: string } | null;
    search?: string;
    clientId: string;
    year?: string;
}) => {
    const res = await axiosClient.get(`/clients/${clientId}/document`, {
        params: {
            cursorUploadedAt: pageParam?.uploadedAt,
            cursorId: pageParam?.id,
            search,
            // clientId,
            year
        }
    })
    return res.data;
}
