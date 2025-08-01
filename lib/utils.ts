import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { auth } from '@/lib/auth';
import axios from 'axios';
import { getSession } from "next-auth/react";

// Add Razorpay type to the Window interface
declare global {
  interface Window {
    Razorpay: any;
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPlanExpiryDate = (duration: string): Date => {
  if (duration === "1y") {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }

  if (duration === "6m") {
    const date = new Date();
    date.setMonth(date.getMonth() + 6);
    return date;
  }
  return new Date(); // Default to current date if no valid duration is provided
}

export const getPlanName = (amoutn: number): string => {
  switch (amoutn) {
    case 600:
      return "1y";
    case 350:
      return "6m";
    case 0:
      return "ff"; // Forever Free
  }
  return "unknown-plan"; // Default case if no match found
}


export const checkOutHandler = async (amount: number, userId: string, plan: string, accessToken: string): Promise<any> => {
  // const session = await auth();
  // const user = session?.user;
  // console.log("session in checkout handler", session);
  // if (!session || !session.accessToken) {
  //   throw new Error("User is not authenticated");
  // }
  if (!amount || !userId || !plan) {
    throw new Error("Amount, userId, expiresAt, and plan are required");
  }
  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }

  const expiresAt = getPlanExpiryDate(plan);

  const data = await fetch(`${process.env.API_SERVER_BASE_URL}/payment/getKey`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
  });
  const dataJson = await data.json();

  const key = dataJson.key;

  const orderRes = await fetch(`${process.env.API_SERVER_BASE_URL}/payment/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      amount,
      expiresAt,
      plan,
      userId
    }),
  });

  const orderJson = await orderRes.json();

  if (!orderJson.success) {
    throw new Error("Failed to create checkout session");
  }
  if (!orderJson.order) {
    throw new Error("Order creation failed");
  }
  const { order } = orderJson;

  const options = {
    key,
    amount: order.amount,
    currency: "INR",
    name: "FileMate",
    description: "FileMate Subscription",
    image: "https://avatars.githubusercontent.com/u/25058652?v=4",
    order_id: order.id,
    callback_url: `${process.env.API_SERVER_BASE_URL}/payment/paymentverification`,
    prefill: {
      name: "Siddharth",
      email: "gaurav.kumar@example.com",
      contact: "9999999999"
    },
    notes: {
      "address": "Razorpay Corporate Office"
    },
    theme: {
      "color": "#121212"
    }
  }
  console.log("window.Razorpay", window.Razorpay);
  const rzp = new window.Razorpay(options);
  rzp.open();

}

export const axiosInstance = axios.create({
  baseURL: process.env.API_SERVER_BASE_URL
});
export const axiosClient = axios.create({
  baseURL: process.env.API_SERVER_BASE_URL
});

axiosClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    const token = session?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
  , (error) => {
    return Promise.reject(error);
  }
);

export function formatBytes(bytes: number | bigint, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const b = typeof bytes === 'bigint' ? Number(bytes) : bytes;
  const i = Math.floor(Math.log(b) / Math.log(k));

  const value = b / Math.pow(k, i);
  return `${value.toFixed(decimals)} ${sizes[i]}`;
}


export function extractS3Key(cloudfrontUrl: string) {
  const url = new URL(cloudfrontUrl);
  const path = url.pathname; // gets '/path/to/object.jpg'
  return decodeURIComponent(path.slice(1)); // remove leading '/' and decode
}
