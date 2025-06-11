"use client"
import React from 'react'
import { useSession } from 'next-auth/react';
import { Progress } from "@/components/ui/progress"
function Info() {
    const session = useSession();
    const userName = (session?.data?.user.name)
        ?.split(" ")[0]
        ?.toLowerCase()
        .replace(/^\w/, c => c.toUpperCase());


    return (
        <div className='max-w-7xl mx-auto px-4'>
            <div>
                <div className='text-4xl'>
                    Wellcome {userName}!
                </div>
                <div>
            
                </div>
            </div>
        </div>

    )
}

export default Info