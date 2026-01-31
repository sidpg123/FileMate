import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/Provider";

const sansFont = Source_Sans_3({
  weight: "500",
  subsets: ["latin"],
  display: 'swap',
  adjustFontFallback: false,
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Filesmate",
  description: "Store Smart, Access Fast!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"  data-scroll-behavior="smooth">
      <body className={`${sansFont.className} antialiased`}>
        <Providers>
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
