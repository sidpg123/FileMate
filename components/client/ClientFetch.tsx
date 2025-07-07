"use client";
import { fetchClientById } from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";
import ClientInfo from "./ClientInfo";
import { useCurrentClient } from "@/store/store";
import { useEffect, useMemo } from "react";

export default function ClientFetch({
    clientId,
    // accessToken,
}: {
    clientId: string;
    // accessToken: string;
}) {
    const { data } = useQuery({
        queryKey: ["client", clientId],
        queryFn: async () => {
            const res = await fetchClientById({
                clientId,
                // accessToken,
            });
            if (!res.success) {
                throw new Error("Network response was not ok");
            }
            return res;
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });

    const { setClientId, setEmail, setName, setPhone, setPendingFees } = useCurrentClient(
        (state) => state
    );


    const pendingFees: number = useMemo(() => {
        return data?.client?.fees
            ?.filter((fee: { status: string; amount: number }) => fee.status === "Pending")
            .reduce((total: number, fee: { amount: number }) => total + fee.amount, 0) || 0;
            // console.log("Pending Payment: ", pendingFees);
    }, [data]);
    // ✅ Run once when data is fetched
    useEffect(() => {
        if (data?.client) {
            setClientId(data.client.id || "");
            setName(data.client.name || "");
            setEmail(data.client.email || "");
            setPhone(data.client.phone || "");
            setPendingFees(pendingFees || 0);
        }
        console.log("ClientFetch data: ", data);
    }, [data]);

   


    return (
        <div>
            <ClientInfo />
        </div>
    );
}
