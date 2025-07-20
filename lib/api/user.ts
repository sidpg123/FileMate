import { UserInfoResponse } from "@/types/api/user";
import { axiosClient } from "../utils";
// import { signOut } from "./auth";

// lib/api.ts
export const getUserInfo = async (): Promise<UserInfoResponse> => {
  // console.log("fetching user info")
  // const res = await fetch(`${process.env.API_SERVER_BASE_URL}/user/info`);
  // console.log(token)
  // console.log("Status: ", res.status)
  const response = await axiosClient.get('/user/info')

  return response.data;
};
