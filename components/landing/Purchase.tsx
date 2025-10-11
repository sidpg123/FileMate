"use client";
import Script from 'next/script';
import React from 'react'
import Subscription from '../ui/Subscription';
import { checkOutHandler } from '@/lib/utils';
import { useRouter } from 'next/navigation';
// import { SessionProvider } from 'next-auth/react';

function Purchase() {
    const router = useRouter();
    return (
        // <SessionProvider>

        <section id='purchase' className='pb-10'>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy={"afterInteractive"} />
            <div className="text-center">
                <h1 className="text-sm tracking-widest"> Plans That Make Sense</h1>
                <h1 className="text-2xl tracking-wider p-3">
                    So... You Like filesmate?
                </h1>
                <h1 className="text-sm mx-4 text-slate-500">
                    Now&apos;s the perfect time to go premium and unlock the real magic.

                    <br /> Free is cool. Paid is cooler. You decide.
                </h1>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-4">

                <Subscription logo={"/images/landingPage/FF.jpeg"} title={"Forever Free"} description={"Perfect if you are just getting started"} amount={{
                    value: 0,
                    duration: "Free"
                }} buttonText={"Register for Free"} checkoutHandler={() => {
                    router.push("/signup")
                }} featureList={[
                    "500MB of storage",
                    "10 clients supported",
                    "Upload and download files",
                ]} />

                <Subscription logo={"/images/landingPage/1y.jpg"} title={"Annual Pro Plan"} description={"All premium tools for an entire year. Best value for consistent usage."} buttonStyle="w-full bg-blue-600 text-white hover:bg-blue-500 hover:text-white transition-colors" amount={{
                    value: 600,
                    duration: "1 year"
                }} buttonText={"Subscribe for 1 Year"} checkoutHandler={checkOutHandler} featureList={[
                    "Secure 10GB of storage",
                    "Unlimited clients supported",
                    "Upload and download files",
                    "Priority support",
                    "Access to premium features",
                ]} />
                <Subscription logo={"/images/landingPage/6m.avif"} title={" 6-Month Professional Plan"} description={"Ideal for short-term needs and testing client collaboration."} amount={{
                    value: 400,
                    duration: "6 months"
                }} buttonText={"Subscribe for 6 Months"} checkoutHandler={checkOutHandler} featureList={[
                    "Secure 10GB of storage",
                    "Unlimited clients supported",
                    "Upload and download files",
                    "Priority support",
                    "Access to premium features",
                ]} />
            </div>


        </section>
        // </SessionProvider>
    )
}

export default Purchase

