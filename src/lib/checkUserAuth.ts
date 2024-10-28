import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function checkUserAuth() {
   const { getUser } = getKindeServerSession();
   const userIfAny = await getUser();
   
   if (!userIfAny) redirect("/");

   return userIfAny;
}