import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export async function checkNormalUserAuth() {
   const { getUser } = getKindeServerSession();
   const userIfAny = await getUser();
   
   if (!userIfAny) redirect("/api/auth/login");

   return userIfAny;
}

export async function checkAdminUserAuth() {
   const { getPermission, getUser } = getKindeServerSession();
   const hasAdminPermission = await getPermission('add_new_users');

   if (!hasAdminPermission?.isGranted) redirect("/");

   const adminUser = await getUser();

   return adminUser!;
}