"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import React from 'react'

interface clientCardProps {
    name: string,
    status: string,
    pendingPayment: string,
    phoneNumber: string,
    // email: string,
    id: string
}

const ClientCard: React.FC<clientCardProps> = ({ name, phoneNumber, status, pendingPayment, id }) => {
    const pendingPaymentNumber = Number(pendingPayment);
    const router = useRouter();
    return (
        <div className='shadow-md rounded-lg p-6'>
            <div className='flex flex-row justify-between'>
                <div className='flex flex-col justify-center'>
                    <div className=' text-lg'>{name}</div>
                    <div className=' text-slate-500'>Phone No.: {phoneNumber}</div>
                </div>

                <div className='flex flex-col gap-2 '>
                    <div
                        className={`mx-4 ${pendingPaymentNumber > 0
                                ? 'bg-red-200 text-red-600'
                                : 'bg-green-200 text-green-600'
                            } rounded-full p-2 text-center`}
                    >
                        🚨 Pending: {pendingPaymentNumber.toLocaleString("en-IN")}
                    </div>

                    <div
                        className={`mx-4 ${status === 'active'
                                ? 'bg-green-200 text-green-600'
                                : 'bg-red-200 text-red-600'
                            } rounded-full p-2 text-center`}
                    >
                        {status === 'active' ? '✅ Active' : '❌ Inactive'}
                    </div>

                    <div className='flex justify-center items-center'>
                        <Button className=' bg-[#4A72FF] hover:bg-blue-500 shadow-md shadow-blue-600 w-4/5' onClick={() => router.push(`/dashboard/client/${id}`)}>
                            Open
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientCard