import { UserInfoResponse } from "@/types/api/user";
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