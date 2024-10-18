import GenericMCQApp from "@/app/ui/GenericMCQApp";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import qnCategoriesData from "@/lib/data";

export default async function Page({ params }: { params: { slug: string[] | undefined } }) {
   const { isAuthenticated } = getKindeServerSession();
   const isLoggedIn = await isAuthenticated();

   if (!isLoggedIn) redirect("/");

   return <GenericMCQApp 
      slug={params.slug?.join("")}
      qnCategory={qnCategoriesData.gep}
   />;
}