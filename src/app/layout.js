import MainNavbar from "@/app/ui/MainNavbar";
import { inter } from "@/app/lib/fonts";
import "@/app/styles/global.css";

export const metadata = {
   title: "English Tutor",
   description: "A side project",
   icons: {
      icon: "/favicon.ico",
   },
};

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <body className={`${inter.className} antialiased`}>
            <MainNavbar />
            {children}
         </body>
      </html>
   );
}
