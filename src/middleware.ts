import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function middleware(request: NextRequest) {
   const { getUser } = getKindeServerSession();
   const userIfAny = await getUser();

   if (!userIfAny) {
      return NextResponse.redirect(new URL("/api/auth/login", request.url))
   }

   const requestHeaders = new Headers(request.headers);
   requestHeaders.set("x-user-given-name", userIfAny.given_name!);
   requestHeaders.set("x-user-id", userIfAny.id);
   requestHeaders.set("x-user-email", userIfAny.email!);

   return NextResponse.next({
      request: {
         headers: requestHeaders,
      },
   });
}

export const config = {
   matcher: ["/profile/:path*", "/mcq/:path*", "/cloze/:path*", "/test/:path*"],
};
