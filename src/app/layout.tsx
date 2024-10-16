import React from "react";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "@/lib/global.css";
import { Inter } from 'next/font/google';

import MainNavbar from "@/app/ui/MainNavbar";

export const metadata = {
   title: "Sunbird English",
   description: "Simple english vocabulary MCQ quiz app. For Singaporean students.",
   icons: {
      icon: "/favicon.ico",
   },
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en">
         <body className={`${inter.className} antialiased`}>
            <MainNavbar />
            {children}
            <Analytics />
            <SpeedInsights />
         </body>
      </html>
   );
}
