"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import NewClientDialog from "./NewClientDialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { toast } from "sonner";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
}

const NavLink = ({ href, children, mobile = false, onClick }: NavLinkProps) => {
  const baseClasses = mobile
    ? "block py-3 px-4 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
    : "relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 group";

  return (
    <Link href={href} className={baseClasses} onClick={onClick}>
      {children}
      {!mobile && (
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
      )}
    </Link>
  );
};

function Navbar() {
  const router = useRouter();
  const [isClick, setIsClick] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleNavbar = () => {
    setIsClick(!isClick);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    signOut();
    router.push('/signin');
    toast.success("You have successfully signed out", {
      duration: 6000,
      description: "You will be redirected to the sign-in page.",
    });
    setIsClick(false);
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
          : 'bg-white border-b border-gray-100'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link
                  href="/"
                  className="flex items-center space-x-2 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#4A72FF] via-[#5C53D1] to-[#712D99] rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                    <span className="text-white font-bold text-sm">FM</span>
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-[#4A72FF] via-[#5C53D1] to-[#712D99] bg-clip-text text-transparent">
                    Filesmate
                  </span>
                </Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-8">
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/dashboard/mydocs">My Documents</NavLink>
                {/* <NavLink href="/dashboard/analytics">Analytics</NavLink> */}
                <NavLink href="/dashboard/mysubscriptions">Subscriptions</NavLink>
              </div>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center space-x-4">
              <NewClientDialog />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <Avatar className="h-9 w-9 shadow-md ring-2 ring-gray-100 hover:ring-blue-200 transition-all duration-200">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-r from-gray-100 to-gray-200">
                        <Image
                          width={36}
                          height={36}
                          src="https://res.cloudinary.com/dbowtoxfh/image/upload/v1749619558/profile-fallback.e7a6f788830c_xjyd8m.jpg"
                          alt="Profile"
                          className="rounded-full object-cover"
                        />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg">
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors focus:bg-red-50 focus:text-red-700"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                onClick={toggleNavbar}
                variant="ghost"
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isClick ? (
                  <CloseIcon className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Full Screen Overlay */}
        {isClick && (
          <div className="fixed inset-0 top-16 z-40 md:hidden">
            <div className="absolute inset-0 bg-white/95 backdrop-blur-md">
              <div className="flex flex-col h-full">
                {/* Navigation Links */}
                <div className="flex-1 px-6 py-8 space-y-4">
                  <NavLink href="/dashboard" mobile onClick={() => setIsClick(false)}>
                    Dashboard
                  </NavLink>
                  <NavLink href="/dashboard/mydocs" mobile onClick={() => setIsClick(false)}>
                    My Documents
                  </NavLink>
                  {/* <NavLink href="/dashboard/analytics" mobile onClick={() => setIsClick(false)}>
                    Analytics
                  </NavLink> */}
                  <NavLink href="/dashboard/mysubscriptions" mobile onClick={() => setIsClick(false)}>
                    Subscriptions
                  </NavLink>
                </div>

                {/* Bottom User Section */}
                <div className="border-t border-gray-200 bg-gray-50/50 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <Image
                          width={48}
                          height={48}
                          src="https://res.cloudinary.com/dbowtoxfh/image/upload/v1749619558/profile-fallback.e7a6f788830c_xjyd8m.jpg"
                          alt="Profile"
                          className="rounded-full object-cover"
                        />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-base font-medium text-gray-900">User Account</p>
                      <p className="text-sm text-gray-500">Manage your files</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* <div onClick={() => setIsClick(false)}>
                      <NewClientDialog />
                    </div> */}

                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;