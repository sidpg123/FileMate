"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";

const images = [
  { id: 1, src: "/images/people/p1.jpg", alt: "Image 1" },
  { id: 2, src: "/images/people/p2.jpg", alt: "Image 2" },
  { id: 3, src: "/images/people/p3.jpg", alt: "Image 3" },
  { id: 4, src: "/images/people/p4.jpg", alt: "Image 4" },
];

export default function ImageToggleComponent() {
  const [activeImage, setActiveImage] = useState(1);

  return (
    <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-4 md:space-y-0">
      {/* Buttons */}
      <div className="flex flex-col space-y-4 md:w-1/4">
        {images.map((image) => (
          <Button
            key={image.id}
            onMouseEnter={() => setActiveImage(image.id)} // Hover effect on desktop
            onClick={() => setActiveImage(image.id)} // Click support for mobile
            className="w-full"
          >
            Button {image.id}
          </Button>
        ))}
      </div>

      {/* Images */}
      <div className="md:w-3/4 flex justify-center items-center relative h-[500px] w-[500px]">
        {images.map((image) => (
          <Image
            key={image.id}
            src={image.src}
            alt={image.alt}
            width={500}
            height={500}
            className={`absolute transition-opacity duration-300 ${
              image.id === activeImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
