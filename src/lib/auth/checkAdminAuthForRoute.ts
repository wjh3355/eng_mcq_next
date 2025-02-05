"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import getAuthUserByEmail from "../mongodb/users/getAuthUserByEmail";

export async function checkAdminAuthForRoute(): Promise<User> {

   const session = await auth();
   if (!session) redirect("/");
   const currUser = await getAuthUserByEmail(session.user?.email!);
   if (!currUser.isAdmin) redirect("/");
   return currUser;
}