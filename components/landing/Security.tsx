"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function SecurityComponent({
  centerImage,
  roundImages,
  keyImages = [], // Indices of images that should have keys
}: {
  centerImage: string;
  roundImages: string[];
  keyImages?: number[];
}) {
  return (
    <div className="relative flex items-center justify-center h-[350px] w-full">
      {/* Background Circles */}
      <div className="absolute w-[220px] h-[220px] bg-slate-100 rounded-full opacity-40"></div>
      <div className="absolute w-[150px] h-[150px] bg-blue-100 rounded-full opacity-75"></div>
      <div className="absolute w-[90px] h-[90px] bg-blue-700 rounded-full opacity-75"></div>

      {/* Center Logo */}
      <div className="relative z-10">
        <Image
          src={centerImage}
          width={55}
          height={55}
          alt="Center Logo"
          className="rounded-full"
        />
      </div>

      {/* Circular Positioned Images */}
      {roundImages.map((src, index) => {
        const angle = (index * 360) / roundImages.length;
        const hasKey = keyImages.includes(index); // Check if this image should have a key

        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              transform: `rotate(${angle}deg) translate(120px) rotate(-${angle}deg)`,
            }}
          >
            <motion.div
              className="relative w-[45px] h-[45px] rounded-full bg-white p-1 shadow-lg flex items-center justify-center"
              whileHover={{ scale: 1.2 }}
            >
              <Image
                src={src}
                width={40}
                height={40}
                alt="Document"
                className="rounded-full"
              />

              {/* Key Icon (Only on selected images) */}
              {hasKey && (
                <div className="absolute -top-1 -right-1  p-1 rounded-full ">
                  <Image
                    src="/images/key.png"
                    width={30}
                    height={16}
                    alt="Key Icon"
                    className="absolute -top-1 -right-1 h-8 w-14"
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
