"use client";
import Subscription from "@/components/ui/Subscription";
import { checkOutHandler } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Script from "next/script";
import { useEffect } from "react";


export default function Demo() {
  const { data: session, status } = useSession();
  console.log("session in demo", session);
  // console.log("status in demo", status);
  console.log("hitted demo");
  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated" && session?.accessToken) {
        const res = await fetch(`http://localhost:5000/api/v1/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.accessToken}`,
          },
        });
        console.log(`in demo Bearer ${session.accessToken}`);
        const data = await res.json();
        console.log("res", data);
      }
    };

    fetchData();
  }, [status, session]);

  return <div>
      </div>;
}

