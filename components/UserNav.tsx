"use client";
import { Button } from "@/components/ui/button";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import NewClientDialog from "./NewClientDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { sign } from "crypto";
import Image from "next/image";
import { toast } from "sonner";

function Navbar() {
  const router = useRouter()
  const [isClick, setIsClick] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsClick(!isClick);
  };

  return (
    <>
      <nav className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link className="font-sans font-h bg-gradient-to-r from-[#4A72FF] via-[#5C53D1] to-[#712D99] bg-clip-text text-transparent" href={"/"}>
                  FileMate
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-16">
                <Link href={"/dashboard"}>Dashboard</Link>
                <Link href={"/dasboard/mydocs"}>My Documents</Link>
                <Link href={"/dashboard/payments"}>Payments</Link>
                <Link href={"/dashboard/mysubscriptions"}>Subscriptions</Link>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <NewClientDialog />
              {/* <Avatar className="shadow-lg shadow-blue-500">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="shadow-lg shadow-blue-300 cursor-pointer">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      <Image width={30} height={20} src="https://res.cloudinary.com/dbowtoxfh/image/upload/v1749619558/profile-fallback.e7a6f788830c_xjyd8m.jpg" alt={""} />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-4">
                  {/* <DropdownMenuLabel>Account</DropdownMenuLabel> */}
                  <DropdownMenuItem onClick={() => {
                    signOut()
                    router.push('/signin')
                    toast.success("You have successfully signed out", {
                      duration: 6000,
                      description: "You will be redirected to the sign-in page.",
                    })

                    }}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="md:hidden flex items-center">
              <Button
                onClick={toggleNavbar}
                variant={"secondary"}
                className="inline-flex items-center justify-center p-2 text-[#FFFFFF] hover:text-800 focus:outline-none bg-white  focus:ring-2 focus:ring-inset focus:ring-white"
              >
                {isClick ? (
                  <CloseIcon
                    color="warning"
                    fontSize="large"
                    className="text-4xl"
                  />
                ) : (
                  <MenuIcon
                    color="primary"
                    fontSize="large"
                    className="text-4xl"
                  />
                )}
              </Button>
            </div>
          </div>
        </div>
        {isClick && (
          <div className="md:hidden">
            <div className="px-2 pb-3 pt-1 space-y-3 flex flex-col items-center">
              <Link
                className="block hover:border hover:border-cyan-600 p-3 px-4 w-full text-center"
                href={"/"}
              >
                About
              </Link>

              <Link
                className="block hover:border hover:border-cyan-600 p-3 px-4 w-full text-center"
                href={"/"}
              >
                Contact
              </Link>
              <Link
                className="block hover:border hover:border-cyan-600 p-3 px-4 w-full text-center"
                href={"/"}
              >
                FAQ
              </Link>
              <Link
                className="block hover:border hover:border-cyan-600 p-3 px-4 w-full text-center"
                href={"/signin"}
              >
                Log in
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
