// import React from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BarChart3, ChevronDown, ChevronUp, CreditCard, HardDrive, IndianRupee } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";
import MetricCard from "../MetricCard";
import { useQuery } from "@tanstack/react-query";
import { getTotalPendingFees } from "@/lib/api/client-dashboard";
import { toast } from "sonner";
export default function Hero({
    view,
    setView
}: {
    view: 'documents' | 'payments';
    setView: (view: 'documents' | 'payments') => void;
}) {
    const [isVisible, setIsVisible] = useState(true);
     const session = useSession();
      const userName = (session?.data?.user.name)
        ?.split(" ")[0]
        ?.toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase());
    

    const { data, isError } = useQuery({
        queryKey: ["clientTotalPendingFees"],
        queryFn: getTotalPendingFees,
        refetchOnWindowFocus: false,
    })

    if(isError) {
        //console.log(error);
        toast.error("Error fetching total fees");
    }
    

    return (
        <div>
            <section className="w-full max-w-7xl mx-auto mt-8">
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

                {/* Main Hero Card */}
                <div className={`transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 scale-100 mb-8' : 'opacity-0 scale-95 mb-0 h-0 overflow-hidden'
                    }`}>
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-blue-50/50 border border-slate-200/60 shadow-xl shadow-slate-900/5">
                        {/* Background Decorative Elements */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl translate-x-20 -translate-y-20"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl -translate-x-20 translate-y-20"></div>
                        </div>

                        <div className="relative p-4 sm:p-6 lg:p-8">
                            {/* Mobile Layout */}
                            <div className="block lg:hidden space-y-6">
                                {/* Welcome Section - Mobile */}
                                <div className="text-center">
                                    <div className="relative mb-4 inline-block">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur opacity-20"></div>
                                        <Avatar className="relative w-16 h-16 border-4 border-white shadow-lg">
                                            <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                                {userName?.[0] || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="space-y-1 mb-6">
                                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                                            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                                Welcome back,
                                            </span>
                                            {/* <br /> */}
                                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                                                {userName}
                                            </span>
                                        </h1>
                                        <p className="text-slate-600 text-sm font-medium">
                                            {session.data?.user?.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Metrics Section - Mobile */}
                                <div className="grid grid-cols-1 gap-3">
                                    <div>

                                        <MetricCard
                                            label="Pending Fees"
                                            value={data?.summary.pending.amount ?? "-"}
                                            icon={<IndianRupee className="w-5 h-5" />}
                                            gradient="from-emerald-500 to-teal-600"
                                            bgGradient="from-emerald-50 to-teal-50"
                                        />
                                        <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
                                            <Button
                                                onClick={() => setView('payments')}
                                                disabled={view === 'payments'}
                                                className={`shadow-lg hover:shadow-xl transition-all duration-200 w-11/12 ${view === 'payments'
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
                                                className={`border-blue-200 transition-all duration-200 w-11/12 ${view === 'documents'
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                                                    : 'text-blue-700 hover:bg-blue-50'
                                                    }`}
                                            >
                                                <HardDrive className="w-4 h-4 mr-2" />
                                                View Documents
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden lg:grid lg:ml-10 lg:grid-cols-12 gap-8 items-center">
                                {/* Welcome Section - Desktop */}
                                <div className="lg:col-span-6 flex flex-col items-start text-left">
                                    <div className="relative mb-4">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur opacity-20"></div>
                                        <Avatar className="relative w-16 h-16 border-4 border-white shadow-lg">
                                            <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                                {userName?.[0] || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="space-y-1">
                                        <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                                            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                                Welcome back,
                                            </span>
                                            <br />
                                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                                                {userName}
                                            </span>
                                        </h1>
                                        <p className="text-slate-600 text-base font-medium">
                                            {session.data?.user?.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Metrics Section - Desktop */}
                                <div className="lg:col-span-6 space-y-3 col- ">
                                    <div>

                                        <MetricCard
                                            label="Pending Fees"
                                            value={data?.summary.pending.amount ?? "-"}
                                            icon={<IndianRupee className="w-5 h-5" />}
                                            gradient="from-emerald-500 to-teal-600"
                                            bgGradient="from-emerald-50 to-teal-50"
                                        />
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </section>
        </div>
    )
}
