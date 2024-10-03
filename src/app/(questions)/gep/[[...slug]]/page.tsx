import GEP_App from "../GEP_App";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { slug: string[] | undefined } }) {
   const { isAuthenticated } = getKindeServerSession();
   const isLoggedIn = await isAuthenticated();

   if (!isLoggedIn) redirect("/");

   return <GEP_App slug={params.slug} />;
   
}