import GEPMCQApp from "@/app/ui/GEPMCQApp";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Page({params}) {
   const { isAuthenticated } = getKindeServerSession();
   const isLoggedIn = await isAuthenticated();
   if (!isLoggedIn) {
      redirect('/');
   };

   return(
      <GEPMCQApp slug={params.slug}/>
   );
}