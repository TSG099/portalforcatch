import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthSessionLogger } from "@/components/AuthSessionLogger";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CATCH Chapter Portal",
  description:
    "Internal portal for CATCH university chapters to manage toy modifications and resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#FFF7E3] text-[#3F3A36]`}
      >
        <AuthSessionLogger />
        {children}
      </body>
    </html>
  );
}

