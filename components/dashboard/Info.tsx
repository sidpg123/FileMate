
"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserInfo } from "@/lib/api/user";
import { formatBytes } from "@/lib/utils";
import { useUserDetailsStore } from "@/store/store";
import { UserInfoResponse } from "@/types/api/user.types";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, ChevronDown, ChevronUp, Database, IndianRupee, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import MetricCard from "../MetricCard";

export default function InfoHero() {
  const [isVisible, setIsVisible] = useState(true);
  const session = useSession();
  const userName = (session?.data?.user.name)
    ?.split(" ")[0]
    ?.toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
  const setName = useUserDetailsStore((state) => state.setName);
  const setEmail = useUserDetailsStore((state) => state.setEmail);
  const setId = useUserDetailsStore((state) => state.setId);

  useEffect(() => {
    if (session.data) {
      setName(session.data.user.name || "");
      setEmail(session.data.user.email || "");
      setId(session.data.user.id || "");
    }
  }, [session.data?.user?.id, session.data, setName, setEmail, setId]);

  const { data, error } = useQuery<UserInfoResponse>({
    queryKey: ["userInfo"],
    queryFn: async () => getUserInfo(),
  });

  if (error) {
    toast.error(error.message);
  }

  const storageUsed = data?.data.storageUsed ?? 0;
  const allocatedStorage = data?.data.allocatedStorage ?? 1;
  const progressValue: number = (storageUsed / allocatedStorage) * 100;

  return (
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
      <div className={`transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-100 scale-100 mb-8' : 'opacity-0 scale-95 mb-0 h-0 overflow-hidden'
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
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                      {userName}
                    </span>
                  </h1>
                  <p className="text-slate-600 text-sm font-medium">
                    {session.data?.user?.email}
                  </p>
                </div>
              </div>

              {/* Storage Section - Mobile */}
              <div className="flex justify-center mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Database className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-bold text-slate-800">Storage Usage</span>
                  </div>
                  
                  <div className="relative w-24 h-24 mx-auto mb-2">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="5"
                        fill="none"
                        className="text-slate-200"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="url(#gradient-mobile)"
                        strokeWidth="5"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressValue / 100)}`}
                        className="transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient-mobile" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-black text-slate-800">
                        {progressValue.toFixed(0)}%
                      </span>
                      <span className="text-xs text-slate-500 font-medium">used</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-1 text-slate-600 font-semibold text-xs">
                    <span>{formatBytes(storageUsed)}</span>
                    <span className="text-slate-400">of</span>
                    <span>{formatBytes(allocatedStorage)}</span>
                  </div>
                </div>
              </div>

              {/* Metrics Section - Mobile */}
              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  label="Pending Fees"
                  value={data?.data.totalPendingFees ?? "-"}
                  icon={<IndianRupee className="w-4 h-4" />}
                  gradient="from-emerald-500 to-teal-600"
                  bgGradient="from-emerald-50 to-teal-50"
                />
                <MetricCard
                  label="Active Clients"
                  value={data?.data.totalClients ?? "-"}
                  icon={<Users className="w-4 h-4" />}
                  gradient="from-blue-500 to-purple-600"
                  bgGradient="from-blue-50 to-purple-50"
                />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:ml-10 lg:grid-cols-12 gap-8 items-center">
              {/* Welcome Section - Desktop */}
              <div className="lg:col-span-4 flex flex-col items-start text-left">
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

              {/* Storage Section - Desktop */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Database className="w-4 h-4 text-slate-600" />
                    <span className="text-base font-bold text-slate-800">Storage Usage</span>
                  </div>
                  
                  <div className="relative w-28 h-28 mx-auto mb-2">
                    <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 112 112">
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-slate-200"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        stroke="url(#gradient-desktop)"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 48}`}
                        strokeDashoffset={`${2 * Math.PI * 48 * (1 - progressValue / 100)}`}
                        className="transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient-desktop" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-slate-800">
                        {progressValue.toFixed(0)}%
                      </span>
                      <span className="text-xs text-slate-500 font-medium">used</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-slate-600 font-semibold text-sm">
                    <span>{formatBytes(storageUsed)}</span>
                    <span className="text-slate-400">of</span>
                    <span>{formatBytes(allocatedStorage)}</span>
                  </div>
                </div>
              </div>

              {/* Metrics Section - Desktop */}
              <div className="lg:col-span-4 space-y-3 col- ">
                <MetricCard
                  label="Pending Fees"
                  value={data?.data.totalPendingFees ?? "-"}
                  icon={<IndianRupee className="w-5 h-5" />}
                  gradient="from-emerald-500 to-teal-600"
                  bgGradient="from-emerald-50 to-teal-50"
                />
                <MetricCard
                  label="Active Clients"
                  value={data?.data.totalClients ?? "-"}
                  icon={<Users className="w-5 h-5" />}
                  gradient="from-blue-500 to-purple-600"
                  bgGradient="from-blue-50 to-purple-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
