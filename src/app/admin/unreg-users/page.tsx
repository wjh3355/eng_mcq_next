import { auth } from "@/auth";
import NewUnregUserForm from "./NewUnregUserForm";
import { redirect } from "next/navigation";
import { fetchAllInvites } from "@/lib/mongodb/user-server-actions";
import Invites from "./Invites";

export default async function NewUnregUserFormServer() {

   const session = await auth();
   if (session?.user.role !== "admin") redirect("/");

   const allInvites = await fetchAllInvites();

   return (
      <>
         <NewUnregUserForm/>
         <Invites allInvites={allInvites}/>
      </>
   )
}