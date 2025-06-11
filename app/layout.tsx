import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import RecoilContextProvider from "@/lib/RecoilProvider";

const sansFont = Source_Sans_3({
  weight: "500",
  subsets: ["latin"],
  display: 'swap',
  adjustFontFallback: false,
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Your Mental Wellness Companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sansFont.className} antialiased`}>
        <RecoilContextProvider>
          {children}
          <Toaster richColors />
        </RecoilContextProvider>
      </body>
    </html>
  );
}
