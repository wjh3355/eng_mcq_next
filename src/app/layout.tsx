import React from "react";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "@/styles/global.css";
import { Inter } from 'next/font/google';

import MainNavbar from "@/app/ui/MainNavbar";
import MaintenancePage from "./ui/MaintenancePage";

import AuthProvider from "./ui/AuthProvider";

export const metadata = {
   title: "Sunbird English",
   description: "Simple english vocabulary MCQ quiz app. For Singaporean students.",
   icons: {
      icon: "/favicon.ico",
   },
};

const inter = Inter({ subsets: ['latin'] });
const isUnderMaintenance: boolean = process.env.IS_UNDER_MAINTENANCE === '1';

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <AuthProvider>
         <html lang="en">
            <body className={`${inter.className} antialiased`}>
               {isUnderMaintenance
                  ? <MaintenancePage/>
                  : <>
                     <MainNavbar />
                     {children}
                     <Analytics />
                     <SpeedInsights />
                  </>
               }
            </body>
         </html>
      </AuthProvider>
   );
}
