import PHRASAL_VERBS_App from "../PHRASAL_VERBS_App";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { slug: string[] | undefined } }) {
   const { isAuthenticated } = getKindeServerSession();
   const isLoggedIn = await isAuthenticated();

   if (!isLoggedIn) redirect("/");

   return <PHRASAL_VERBS_App slug={params.slug}/>;

}