import MainNavbar from "@/app/ui/MainNavbar";

import "./styles/global.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
         <MainNavbar/>
         {children}
      </body>
    </html>
  );
}
