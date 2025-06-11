// middleware.ts
import { auth } from "@/lib/auth"; // from NextAuth
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth(); // comes from next-auth/app

  const pathname = req.nextUrl.pathname;

  // Block non-CAs from dashboard
  if (pathname.startsWith("/dashboard") && session?.user?.role !== "CA") {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Block unauthenticated users from client-dashboard
  if (pathname.startsWith("/client-dashboard") && !session) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Block unauthenticated users from dashboard
  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Block authenticated users from sign-in page
  if (pathname === "/signin" && session?.user.role === "CA") {
    // If the user is already authenticated and trying to access the sign-in page, redirect them to the dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if(pathname === "/signin" && session?.user.role === "Client") {
    // If the user is already authenticated as a Client and trying to access the sign-in page, redirect them to the client-dashboard
    return NextResponse.redirect(new URL("/client-dashboard", req.url));
  }


  // Block non-clients from client-dashboard
  if (pathname.startsWith("/client-dashboard") && session?.user?.role !== "Client") {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}
