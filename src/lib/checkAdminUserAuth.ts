import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function checkAdminUserAuth() {
   const { isAuthenticated, getPermission, getUser } = getKindeServerSession();
   const isLoggedIn = await isAuthenticated();
   const hasAdminPermission = await getPermission('add_new_users');

   if (!isLoggedIn || !hasAdminPermission?.isGranted) redirect("/");

   const adminUser = await getUser();

   return adminUser!;
}