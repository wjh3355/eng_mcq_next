import { auth } from "@/auth";
import { NextResponse } from "next/server";

const protectedPaths = [
   "/cloze",
   "/mcq",
   "/profile",
   "/test",
   "/spelling",
   "/definitions"
]

export default auth(req => {
   const { pathname: currPath } = req.nextUrl;

   if (currPath.startsWith("/auth") && req.auth) {
      // all pages under /auth 
      // /auth, /auth/register/[t], /auth/reset-password, /auth/reset-password/[t]
      // should not be accessible if user is already logged in
      // redirect to home page
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`); 
   }
   
   if (protectedPaths.some((protPath) => currPath.startsWith(protPath)) && !req.auth) {
      // all pages under /cloze, /mcq, /profile, /test should not be accessible if user is not logged in
      // redirect to login page
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth`);
   }

   if (currPath.startsWith("/admin") && req.auth?.user.role !== "admin") {
      // all pages under /admin should not be accessible if user is not an admin
      // redirect to home page
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`);
   }
   
   // if no redirect, continue request
   return NextResponse.next();
});

export const config = {
   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
