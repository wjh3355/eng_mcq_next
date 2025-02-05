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

   if (currPath.startsWith("/admin")) {
      return NextResponse.redirect(`${process.env.BASE_URL}`);
   } else if (
      protectedPaths.some(protPath => currPath.startsWith(protPath))
      && !req.auth
   ) {
      return NextResponse.redirect(`${process.env.BASE_URL}/auth`);
   }

   return NextResponse.next();
})

export const config = {
   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}