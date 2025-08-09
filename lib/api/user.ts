// import { UserInfoResponse } from "@/types/api/user";
import { UserInfoResponse } from "@/types/api/user.types";
import { axiosClient } from "../utils";
// import { signOut } from "./auth";

// lib/api.ts
export const getUserInfo = async (): Promise<UserInfoResponse> => {
 
  const response = await axiosClient.get('/user/info')

  return response.data;
};



export const fetchFeesCategories = async () => {
    const res = await axiosClient.get(`user/fees/categories`);
    if (res.status != 200) {
        throw new Error("Failed to fetch fee categories");
    }
    console.log("Fetched Fees Categories: ", res.data);
    return res.data;
}

export const createFeesCategory = async ({ name }: {name: string}) => {
    if(!name) {
        throw new Error("Name is required to create a fee category");
    }

    const res = await axiosClient.post(`user/fees/categories`, { name });

    if(res.status != 201) {
        throw new Error("Failed to create fee category");
    }

    return res.data;
}

export const fetchUserDocuments = async ({
    pageParam,
    search,
    // clientId,
    year
} : {
    pageParam?: {uploadedAt: string; id: string } | null;
    search?: string;
    // clientId: string;
    year?: string;
}) => {
    const res = await axiosClient.get(`/user/documents`, {
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

export const uploadUserDocMetaData = async ({
    data
}: {
    data: {
        // clientId: string,
        fileName: string,
        fileKey: string,
        year: string,
        fileSize: number,
        thumbnailKey: string
    }
}) => {
    try {
        const res = await axiosClient.post(`user/documents`, data);
        console.log("response from uploadDocMetaData: ", res);     
    } catch (error) {
        console.error("Error occured while uploaing document metaData", error)
        throw new Error("Error occured while uploaing document metaData");
    }
    
}