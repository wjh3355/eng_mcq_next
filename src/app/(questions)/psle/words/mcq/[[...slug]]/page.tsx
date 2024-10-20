import GenericMCQApp from "@/app/ui/GenericMCQApp";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import qnCategoriesData from "@/lib/data";

export default async function Page({ params }: { params: { slug: string[] | undefined } }) {
   const { isAuthenticated, getUser } = getKindeServerSession();
   const isLoggedIn = await isAuthenticated();

   if (!isLoggedIn) redirect("/");

   const userName = (await getUser())?.given_name;

   return <GenericMCQApp 
      slug={params.slug?.join("")}
      qnCategory={qnCategoriesData.psleWordsMcq}
      userName={userName || "unknown"}
      trackQns={true}
   />;
}