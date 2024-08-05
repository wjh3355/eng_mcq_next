import "./ui/globals.css";
import Navbar from "@/app/ui/navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
         <Navbar/>
         {children}
      </body>
    </html>
  );
}
