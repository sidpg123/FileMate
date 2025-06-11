"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';

import React from 'react'
import { Button } from './button';

interface params {
    title: string,
    route: string
    styles?: string
    extraComp?: any
}

function HeroRedirect(params: params) {
    const session = useSession();
    const router = useRouter();
    return (
        <>
            {
                session.status === "authenticated" && session.data?.user.role === "CA" ? (
                    <Button onClick={() => {
                        router.push('/dashboard')
                    }} className=" bg-[#4A72FF] hover:bg-blue-500 shadow-md shadow-blue-600">
                        Dashboard
                    </Button>
                ) : session.status === "authenticated" && session.data?.user.role === "Client" ? (
                    <Button onClick={() => {
                        router.push('/client-dashboard')
                    }} className=" bg-[#4A72FF] hover:bg-blue-500 shadow-md shadow-blue-600">
                        Dashboard
                    </Button>
                ) : (
                    <>
                        <Button onClick={() => {
                            router.push(`/${params.route}`)
                        }} className={`${params.styles}  bg-[#4A72FF] hover:bg-blue-500 shadow-md shadow-blue-600`}>
                            {params.title} {params.extraComp}
                        </Button>

                    </>

                )
            }
        </>
    )
}

export default HeroRedirect