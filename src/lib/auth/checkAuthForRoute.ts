"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserProfileDocument } from "@/definitions";
import { getUserServer } from "../mongodb/get-user-server";

export async function checkAuthForRoute(): Promise<UserProfileDocument> {

   const session = await auth();

   if (!session) redirect("/");

   const userDoc = await getUserServer({ email: session.user.email, type: "profile" })

   return userDoc as UserProfileDocument;
}