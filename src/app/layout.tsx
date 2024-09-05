import React from "react";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "@/styles/global.css";
import { inter } from "@/lib/fonts";

import MainNavbar from "@/app/ui/MainNavbar";

export const metadata = {
   title: "Sunbird English",
   description: "Simple english vocabulary MCQ quiz app. For Singaporean students.",
   icons: {
      icon: "/favicon.ico",
   },
};

export default function RootLayout({ 
   children 
}: { 
   children: React.ReactNode 
}) {
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
