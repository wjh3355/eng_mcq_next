import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function checkNormalUserAuth() {
   const { getUser } = getKindeServerSession();
   const userIfAny = await getUser();

   console.log(userIfAny);
   
   if (!userIfAny) redirect("/");

   return userIfAny;
}