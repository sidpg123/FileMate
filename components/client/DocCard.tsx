import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@mui/material";

interface DocCardProps {
  fileName: string;
  thumbnailKey: string;
  fileKey: string;
}

const fallbackThumbnail = "/images/default-thumbnail.png";

const DocCard: React.FC<DocCardProps> = ({ fileName, thumbnailKey, fileKey }) => {
  const [imgSrc, setImgSrc] = useState(thumbnailKey);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="rounded-xl overflow-hidden border shadow-md group hover:shadow-xl transition-all bg-white">
      
      {/* File name */}
      <div className="bg-slate-700 text-white px-4 py-2 text-sm font-semibold truncate">
        {fileName}
      </div>

      {/* Thumbnail */}
      <div className="relative w-full bg-gray-100">

        {isLoading && (
          <div className="flex items-center justify-center w-full object-contain  max-h-44 mx-auto  bg-gray-200 animate-pulse">
            {/* <Skeleton className="w-full h-auto object-contain max-h-44 mx-auto"> Loading...</Skeleton> */}
            <span className="text-sm text-gray-400">Loading thumbnail...</span>
          </div>
        )}

        <img
          src={imgSrc}
          alt="Thumbnail"
          onLoad={() => setIsLoading(false)}
          // onLoadStart={() => setIsLoading(false)}
          onError={() => {
            setImgSrc(fallbackThumbnail);
            setIsLoading(false);
          }}
          className={`w-full h-auto object-contain max-h-44 mx-auto transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          <Link href={fileKey} target="_blank">
            <Button className="bg-white text-black px-4 py-1 rounded-md text-sm font-semibold hover:bg-gray-100 transition">
              Open
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DocCard;
