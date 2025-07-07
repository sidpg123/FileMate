import { UserInfoResponse } from "@/types/api/user";
// import { signOut } from "./auth";

// lib/api.ts
export const getUserInfo = async (token: string): Promise<UserInfoResponse> => {
  // console.log("fetching user info")
  const res = await fetch(`${process.env.API_SERVER_BASE_URL}/user/info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // console.log(token)
  // console.log("Status: ", res.status)

  if (res.status === 404 || res.status === 401) {
    // signOut()
    throw new Error("Unauthorized access",)

  }


  if (!res.ok) {
    throw new Error('Failed to fetch user info');
  }

  return res.json();
};
