"use client"
import { extractS3Key } from "@/lib/utils";
import { Skeleton } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import FileOptionsDropdown from "./FileMenuDropdown";
import { useCurrentFileStore } from "@/store/store";

interface DocCardProps {
  fileName: string;
  thumbnailKey: string;
  fileKey: string;
  year: string;
  fileId: string;
}

const fallbackThumbnail = "/images/default-thumbnail.png";

function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image();

    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

async function waitForThumbnail(thumbnailUrl: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const exists = await checkImageExists(thumbnailUrl);
    if (exists) return true;
    await new Promise((res) => setTimeout(res, 4000));
  }
  return false;
}

const DocCard: React.FC<DocCardProps> = ({ year, fileName, thumbnailKey, fileKey, fileId }) => {
  const [imgSrc, setImgSrc] = useState(thumbnailKey);
  const [isLoading, setIsLoading] = useState(true);  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const setName = useCurrentFileStore((state) => state.setName);
  const setYear = useCurrentFileStore((state) => state.setYear);
  const setKey = useCurrentFileStore((state) => state.setKey);
  const setFileId = useCurrentFileStore((state) => state.setFileId);
 
  useEffect(() => {
    let isMounted = true;
    const checkThumbnail = async () => {
      const thumbnailUrl = thumbnailKey;
      const isReady = await waitForThumbnail(thumbnailUrl);
      if (!isMounted) return;
      if (isReady) {
        setImgSrc(thumbnailUrl);
      } else {
        setImgSrc(fallbackThumbnail);
      }
    };
    checkThumbnail();
    return () => {
      isMounted = false;
    };
  }, [thumbnailKey]);
 
  console.log("ImageSource: ", imgSrc);
 
  const setDocMetaDataState = () => {
    console.log("Setting doc metadata for:", fileName);
    setName(fileName);
    setYear(year);
    setKey(extractS3Key(fileKey));
    setFileId(fileId);
  };
 
  return (
    <div>
      <div className="rounded-xl overflow-hidden border shadow-md group hover:shadow-xl transition-all bg-white hover:scale-105">
        {/* File name */}
        <div className="bg-slate-700 text-white px-4 py-2 text-sm font-semibold truncate">
          <div className="float-right">
            <FileOptionsDropdown 
              isOpen={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
              onAction={setDocMetaDataState}
              cardId={fileId} // Unique identifier for this card
            />
          </div>
          {fileName}
        </div>

        <div className="relative w-full bg-gray-100">
          {isLoading && (
            <div className="flex items-center justify-center w-full object-contain max-h-44 mx-auto bg-gray-200 animate-pulse">
              <Skeleton className="w-full object-contain max-h-44 mx-auto">Loading...</Skeleton>
            </div>
          )}

          <img
            src={imgSrc}
            alt="Thumbnail"
            
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setImgSrc(fallbackThumbnail);
              setIsLoading(false);
            }}
            className={`w-full h-auto max-h-44 mx-auto hover:scale-105 transition-opacity duration-300 ${
              imgSrc.endsWith(".png") ? 'scale-75 object-contain' : "scale-100 object-cover object-top"
            } ${isLoading ? "opacity-50" : "opacity-100"}`}
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
    </div>
  );
};
export default DocCard;