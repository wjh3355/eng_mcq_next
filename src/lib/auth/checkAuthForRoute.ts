"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserProfileDocument } from "@/definitions";
import { fetchUser } from "../mongodb/user-server-actions";

export async function checkAuthForRoute(): Promise<UserProfileDocument> {

   const session = await auth();

   if (!session) redirect("/");

   const res = await fetchUser(session.user.email, "profile");

   if ("error" in res) redirect("/");

   return res;
}