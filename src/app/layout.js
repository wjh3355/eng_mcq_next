import MainNavbar from "@/app/ui/MainNavbar";

import "./styles/global.css";

export const metadata = {
   title: 'English Tutor',
   description: 'My side project',
   icons: {
      icon: '/favicon.ico'
   }
};

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
