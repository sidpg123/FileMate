import axios from 'axios';
import { clsx, type ClassValue } from "clsx";
import { getSession } from "next-auth/react";
import { twMerge } from "tailwind-merge";

// Add Razorpay type to the Window interface
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Razorpay: any;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPlanExpiryDate = (plan: string): Date => {
  if (plan === "925463d3-b270-45b5-8974-944427991663") {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }

  if (plan === "83f76a56-bf26-4d93-920e-31f9b6e425fd") {
    const date = new Date();
    date.setMonth(date.getMonth() + 6);
    return date;
  }
  return new Date(); // Default to current date if no valid duration is provided
}

export const getPlanName = (amoutn: number): string => {
  switch (amoutn) {
    case 600:
      return "925463d3-b270-45b5-8974-944427991663";
    case 400:
      return "83f76a56-bf26-4d93-920e-31f9b6e425fd";
    case 0:
      return "e77dbc82-7325-4823-b3bc-1e8d4675946c"; // Forever Free
  }
  return "unknown-plan"; // Default case if no match found
}


export const checkOutHandler = async (amount: number, userId: string, plan: string, accessToken: string, role: string) => {

  if(role !== 'CA') {
    alert("Your email is already registered. Please contact support to make subscription.")
    return;
  }
  if (!amount || !userId || !plan) {
    throw new Error("Amount, userId, expiresAt, and plan are required");
  }
  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }

  const expiresAt = getPlanExpiryDate(plan);

  const hasActiveSubscription = await fetch(`${process.env.API_SERVER_BASE_URL}/payment/subscription/status`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
  });
  const hasActiveSubscriptionJson = await hasActiveSubscription.json();
  // console.log("hasActiveSubscription", hasActiveSubsdcriptionJson)
  if(hasActiveSubscriptionJson.hasActiveSubscription === true) {
    alert("You already have an active subscription.");
    return; 
  }
  
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
    name: "Filesmate",
    description: "Filesmate Subscription",
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
  // //console.log("window.Razorpay", window.Razorpay);
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
