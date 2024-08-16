import MainNavbar from "@/app/ui/MainNavbar";
import { inter } from "@/lib/fonts";
import "@/styles/global.css";
import React from "react";

export const metadata = {
   title: "Sunbird English",
   description: "A side project",
   icons: {
      icon: "/favicon.ico",
   },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en">
         <body className={`${inter.className} antialiased`}>
            <MainNavbar />
            {children}
         </body>
      </html>
   );
}
