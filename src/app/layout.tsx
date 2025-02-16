import React from "react";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "@/styles/global.css";
import { Inter } from 'next/font/google';

import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/Footer";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

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
      <html lang="en" style={{height: "100%"}}>
         <body className={`${inter.className} antialiased`} style={{height: "100%", display: "flex", flexDirection: "column"}}>
            <SessionProvider>
               <NavBar />
               <main className="mb-4" style={{flex: "1"}}>
                  <Toaster
                     position="top-center"
                     reverseOrder={false}
                     toastOptions={{
                        duration: 6000,
                        className: "p-3 fw-bold",
                     }}
                  />
                  {children}
               </main>
               <Footer />
            </SessionProvider>         
            <Analytics />
            <SpeedInsights />
         </body>
      </html>
   );
}
