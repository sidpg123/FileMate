"use client";
import { fetchClientById } from "@/lib/api/client";
import { useCurrentClient } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import EditClientDialog from "./EditClientDialogue";
import { Skeleton } from "@mui/material";
import { formatBytes } from "@/lib/utils";
import {
    User,
    Phone,
    Mail,
    HardDrive,
    CreditCard,
    CheckCircle2,
    AlertCircle,
    BarChart3,
    ChevronUp,
    ChevronDown
} from "lucide-react";

export default function ClientFetch({
    clientId,
    view,
    setView
}: {
    clientId: string;
    view: 'documents' | 'payments';
    setView: (view: 'documents' | 'payments') => void;
}) {

    const [isVisible, setIsVisible] = useState(true);
    const { data, status } = useQuery({
        queryKey: ["client", clientId],
        queryFn: async () => {
            const res = await fetchClientById({
                clientId,
            });

            if (!res.success) {
                throw new Error("Network response was not ok");
            }
            return res;
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });
    console.log("data", data);
    const { setClientId, setEmail, setName, setPhone, setPendingFees } = useCurrentClient(
        (state) => state
    );

    const pendingFees = data?.summary?.pendingFeesAmount || 0;
    const totalFees = data?.summary?.totalFeesCount || 0;
    const paidFees = data?.summary?.paidFeesAmount || 0;
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    if (status === "pending") {
        return (
            <div className="container mx-auto px-4 mt-8">
                <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-2xl">
                    <CardContent className="p-8">
                        {/* Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                            <div className="flex items-center gap-4 mb-4 lg:mb-0">
                                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                                    <Skeleton className="w-8 h-8 rounded-full" />
                                </div>
                                <div>
                                    <Skeleton className="w-48 h-8 mb-2" />
                                    <Skeleton className="w-32 h-4" />
                                </div>
                            </div>
                            <Skeleton className="w-32 h-10 rounded-lg" />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[1, 2, 3, 4].map((i) => (
                                <Card key={i} className="bg-white/70 backdrop-blur-sm border-0 shadow-md">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="w-8 h-8 rounded" />
                                            <div className="flex-1">
                                                <Skeleton className="w-16 h-4 mb-1" />
                                                <Skeleton className="w-20 h-6" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-600">Email:</span>
                                <Skeleton className="w-40 h-5" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-600">Phone:</span>
                                <Skeleton className="w-32 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 mt-8">
            {/* Toggle Button */}
            <div className="flex justify-center mb-4">
                <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="group flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/90 hover:border-slate-300/60"
                >
                    <BarChart3 className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors" />
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                        {isVisible ? 'Hide Dashboard' : 'Show Dashboard'}
                    </span>
                    {isVisible ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                    )}
                </button>
            </div>



            <div className={`transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 scale-100 mb-8' : 'opacity-0 scale-95 mb-0 h-0 overflow-hidden'
                }`}>

                <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
                    <CardContent className="p-8">
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                            <div className="flex items-center gap-4 mb-4 lg:mb-0">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-1">
                                        {data?.client?.name}
                                    </h1>
                                    <Badge variant="outline" className="bg-white/50 text-blue-700 border-blue-200">
                                        Client ID: {data?.client?.id?.slice(-8)}
                                    </Badge>
                                </div>
                            </div>
                            <EditClientDialog />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Storage Usage */}
                            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <HardDrive className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">Storage Used</p>
                                            <p className="text-lg font-bold text-gray-800">
                                                {formatBytes(data?.client?.storageUsed || 0)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Pending Payment */}
                            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                            <AlertCircle className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">Pending Payment</p>
                                            <p className="text-lg font-bold text-red-600">
                                                {formatCurrency(pendingFees)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Total Fees */}
                            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">Total Fees</p>
                                            <p className="text-lg font-bold text-gray-800">
                                                {totalFees}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Paid Fees */}
                            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">Paid Fees</p>
                                            <p className="text-lg font-bold text-green-600">
                                                {paidFees}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Email</p>
                                        <p className="text-gray-800 font-semibold">
                                            {data?.client?.email || "Not provided"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                                    <Phone className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Phone</p>
                                        <p className="text-gray-800 font-semibold">
                                            {data?.client?.phone || "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
                            <Button
                                onClick={() => setView('payments')}
                                disabled={view === 'payments'}
                                className={`shadow-lg hover:shadow-xl transition-all duration-200 ${view === 'payments'
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                                    } text-white`}
                            >
                                <CreditCard className="w-4 h-4 mr-2" />
                                View Payments
                            </Button>
                            <Button
                                onClick={() => setView('documents')}
                                disabled={view === 'documents'}
                                variant="outline"
                                className={`border-blue-200 transition-all duration-200 ${view === 'documents'
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                                    : 'text-blue-700 hover:bg-blue-50'
                                    }`}
                            >
                                <HardDrive className="w-4 h-4 mr-2" />
                                View Documents
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}