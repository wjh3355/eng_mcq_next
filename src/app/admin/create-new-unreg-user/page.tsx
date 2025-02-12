import { auth } from "@/auth";
import NewUnregUserForm from "./NewUnregUserForm";
import { redirect } from "next/navigation";

export default async function NewUnregUserFormServer() {

   const session = await auth();
   if (session?.user.role !== "admin") redirect("/");

   return <NewUnregUserForm/>
}