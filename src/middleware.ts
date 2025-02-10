import { auth } from "@/auth";
import { NextResponse } from "next/server";

const protectedPaths = [
   "/cloze",
   "/mcq",
   "/profile",
   "/test"
]

export default auth(req => {
   const { pathname: currPath } = req.nextUrl;

   if (currPath.startsWith("/auth") && req.auth) {
      // all pages under /auth (/auth, /auth/register/[token], /auth/reset-password, /auth/reset-password/[token]) should not be accessible if user is already logged in
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`); 
   }
   
   if (currPath.startsWith("/admin") && req.auth?.user.role !== "admin") {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`);
   }
   
   if (
      protectedPaths.some((protPath) => currPath.startsWith(protPath)) &&
      !req.auth
   ) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth`);
   }

   return NextResponse.next();
});

export const config = {
   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
