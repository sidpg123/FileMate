"use client"
import { Progress } from "@/components/ui/progress";
import { getUserInfo } from "@/lib/api/user";
// import { getUserInfo } from '@/lib/user';
import { UserInfoResponse } from '@/types/api/user';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from "sonner";
function Info() {
    const session = useSession();
    const userName = (session?.data?.user.name)
        ?.split(" ")[0]
        ?.toLowerCase()
        .replace(/^\w/, c => c.toUpperCase());

    const { data, error } = useQuery<UserInfoResponse>({
        queryKey: ["userInfo"],
        queryFn: async () => getUserInfo(session.data?.accessToken as string)
    })
    // console.log(error)
    console.log("info rendered");
    if(error) {
        toast.error(error.message);
    }
    // console.log(data);
    return (
        <div className=' mt-8 flex flex-col sm:flex-row sm:justify-between'>
            <div>
                <div className='text-4xl mt-10'>
                    Wellcome {userName}!
                </div>
                <div className="mt-8">
                    <div>Storage used: {data?.data.storageUsed} GB of {data?.data.allocatedStorage} GB</div>
                    <Progress className='max-w-56 h-5' value={70} />
                </div>
            </div>
            <div className="flex flex-col justify-center gap-7 px-4">

                <div className=" h-10 text-white flex items-center justify-center p-4 rounded-lg bg-[radial-gradient(circle,_rgba(63,94,251,1)_0%,_rgba(252,70,107,1)_100%)]">
                    Total Pending Fees: {data?.data.totalPendingFees}
                </div>
                
                <div className=" h-10 text-white flex items-center justify-center p-4 rounded-lg bg-[linear-gradient(124deg,_rgba(34,193,195,1)_0%,_rgba(253,187,45,1)_100%)]">
                    Active Clients: {data?.data.totalClients}
                </div>

            </div>
        </div>

    )
}

export default Info