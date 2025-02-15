"use client";

import Image from "next/image";

export default function PendingFeeTracking() {
  return (
    <div className="flex flex-col items-center justify-center h-[350px]">
      {/* Container */}
      <div className="relative w-[200px] h-[200px] flex items-center justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid-light opacity-20"></div>
    

        {/* Center Circle */}
        <div className="absolute flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full shadow-lg">
          <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full">
            <span className="text-2xl font-bold text-orange-500">₹</span>
          </div>
        </div>

        {/* Dashed Lines */}
        <div className="absolute w-24 h-24 border-dashed border-2 border-blue-300 rounded-full"></div>

        {/* Dashed Line - Top Left (Client 1) */}
        <div className="absolute top-6 -left-2 w-16 h-16 border-t-2 border-l-2 border-dashed border-blue-400 rotate-[-90deg]"></div>

        {/* Dashed Line - Bottom Right (Client 2) */}
        <div className="absolute bottom-6 -right-2 w-16 h-16 border-b-2 border-r-2 border-dashed border-blue-400 rotate-[-90deg]"></div>

        {/* Client Avatars */}
        <div className="absolute -top-5 -left-8">
          <Image
            src="/images/people/p1.jpg"
            width={50}
            height={50}
            alt="Client 1"
            className="rounded-full border-2 border-white shadow-lg"
          />
        </div>
        <div className="absolute -bottom-5 -right-8">
          <Image
            src="/images/people/p2.jpg"
            width={50}
            height={50}
            alt="Client 2"
            className="rounded-full border-2 border-white shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
