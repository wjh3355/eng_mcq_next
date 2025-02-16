import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchAllInvites } from "@/lib/mongodb/user-server-actions";
import Invites from "./Invites";

export default async function NewUnregUserFormServer() {

   const session = await auth();
   if (session?.user.role !== "admin") redirect("/");

   const allInvites = await fetchAllInvites();
   if ("error" in allInvites) return <div>{allInvites.error}</div>;

   return <Invites allInvites={allInvites}/>
}