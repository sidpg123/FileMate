"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserInfo } from "@/lib/api/user";
import { formatBytes } from "@/lib/utils";
import { useUserDetailsStore } from "@/store/store";
import { UserInfoResponse } from "@/types/api/user";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";
import {  IndianRupeeIcon, Users } from "lucide-react";

export default function InfoHero() {
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
  }, [session.data?.user?.id]);

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
    <section
      className="w-full max-w-5xl mx-auto bg-gradient-to-br from-[#f6fafd] via-blue-50 to-[#e6f0fa] rounded-2xl p-6 sm:p-8 mt-8 shadow-sm
        flex flex-col md:flex-row items-center md:items-start gap-8"
      style={{
        minHeight: 260, // not too tall
      }}
    >
      {/* Welcome */}
      <div className="flex-1 flex flex-col items-center md:items-start justify-center gap-2 md:gap-3">
        <Avatar className="w-14 h-14 mb-1 shadow">
          <AvatarFallback className="text-2xl uppercase bg-blue-500 text-white">
            {userName?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Welcome, <span className="text-blue-600">{userName}</span>!
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {session.data?.user?.email}
        </p>
      </div>

      {/* Storage Centerpiece */}
      <div className="flex-1 flex flex-col items-center gap-2">
        <span className="text-base font-semibold text-gray-800">Storage Usage</span>
        <div className="relative w-[180px] sm:w-[250px] h-5 rounded-full bg-slate-200 overflow-hidden shadow">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 transition-all"
            style={{ width: `${Math.min(100, progressValue)}%` }}
          ></div>
          <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold text-white drop-shadow">
            {progressValue.toFixed(1)}%
          </span>
        </div>
        <div className="flex flex-row items-center justify-center gap-1 text-gray-600 mt-1 text-xs sm:text-base font-medium">
          <span>{formatBytes(storageUsed)}</span>
          <span className="text-gray-400">/</span>
          <span>{formatBytes(allocatedStorage)}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex flex-col gap-3 flex-1 w-full md:w-auto items-center">
        <HeroMetric
          label="Pending Fees"
          value={data?.data.totalPendingFees ?? "-"}
          icon={<IndianRupeeIcon className="w-5 h-5 text-blue-600" />}
          accent="from-blue-100 to-blue-200"
        />
        <HeroMetric
          label="Active Clients"
          value={data?.data.totalClients ?? "-"}
          icon={<Users className="w-5 h-5 text-green-600" />}
          accent="from-green-100 to-green-200"
        />
      </div>
    </section>
  );
}

function HeroMetric({
  value,
  label,
  icon,
  accent,
}: {
  value: React.ReactNode;
  label: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div
      className={`flex flex-row items-center gap-2 px-5 py-2 min-w-[140px] shadow rounded-xl bg-gradient-to-tr ${accent}`}
    >
      {icon}
      <div className="flex flex-col">
        <span className="text-lg font-extrabold text-gray-800">{value}</span>
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      </div>
    </div>
  );
}
