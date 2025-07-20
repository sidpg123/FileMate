"use client";
import { fetchClientById } from "@/lib/api/client";
import { useCurrentClient } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { Button } from "../ui/button";
import EditClientDialog from "./EditClientDialogue";
import { Skeleton } from "@mui/material";

export default function ClientFetch({
    clientId,
    // accessToken,
}: {
    clientId: string;
    // accessToken: string;
}) {
    const { data, status } = useQuery({
        queryKey: ["client", clientId],
        queryFn: async () => {
            const res = await fetchClientById({
                clientId,
                // accessToken,
            });
            // await new Promise((resolve) => setTimeout(resolve, 4000)); // 2 seconds

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
        // console.log("ClientFetch data: ", data?.client);
    }, [data]);


    if (status === "pending") {
        return (
            <div>
                <div className="container mt-8 mx-auto">
                    <div className="mt-3 shadow-[5px_10px_32px_3px_#388ef1] rounded-xl p-6">
                        {/* Header */}
                        <div className="sm:flex items-center">
                            <Skeleton className="w-full text-3xl sm:w-2/5 md:w-1/5 lg:w-1/6  sm:text-4xl text-slate-800 font-light  py-3 mb-2" />
                            <Skeleton className="w-full sm:w-2/5 md:w-1/5 lg:w-1/6 ml-auto mt-3 sm:mt-0 py-4" />
                        </div>

                        {/* Info Section */}
                        <div className="sm:flex sm:justify-between mt-4 flex-wrap gap-4">
                            <div className="text-gray-600 text-lg mb-2">
                                Phone No: <span className="inline-block align-middle"><Skeleton className="inline-block w-24 h-5 rounded-lg" /></span>
                            </div>
                            <div className="text-gray-600 text-lg mb-2">
                                Email: <span className="inline-block align-middle"><Skeleton className="inline-block w-40 h-5 rounded-lg" /></span>
                            </div>
                            <Skeleton className="w-full sm:w-1/6 h-8 mt-3 sm:mt-0" />
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    return (
        <div>
            {/* <ClientInfo /> */}
            <div>
                <div className="container mt-8 mx-auto">
                    <div className=" mt-3 shadow-[5px_10px_32px_3px_#388ef1] rounded-xl  p-6">
                        <div className=' sm:flex '>
                            <h2 className="text-3xl sm:text-4xl  text-slate-800 font-light  mb-2">{data?.client?.name}</h2>
                            <Button className='w-full sm:w-2/5 md:w-1/5 lg:w-1/6 ml-auto mt-3 sm:mt-0 bg-blue-500 text-white hover:bg-blue-600 text-wrap  shadow-md shadow-blue-500'>
                                Pending Payment: {pendingFees}
                            </Button>
                        </div>
                        <div className='sm:flex sm:justify-between mt-4'>
                            <p className="text-gray-600 text-lg mb-2">Email: {data?.client?.email}</p>
                            <p className="text-gray-600 text-lg mb-2">Phone: {data?.client?.phone}</p>
                            <EditClientDialog />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
