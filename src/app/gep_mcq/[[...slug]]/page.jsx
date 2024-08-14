import GEPMCQApp from "@/app/gep_mcq/GEPMCQApp";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

export default async function Page({params}) {
   const { isAuthenticated } = getKindeServerSession();
   const isLoggedIn = await isAuthenticated();
   if (!isLoggedIn) {
      redirect('/');
   };

   const availableRoutes = [
      undefined,
      "set1",
      "set2",
      "set3",
      "set4",
      "set5",
      "set6"
   ];

   const slug = params.slug?.join('');

   if (!availableRoutes.includes(slug)) {
      notFound();
   };

   return(
      <GEPMCQApp slug={slug}/>
   );
}