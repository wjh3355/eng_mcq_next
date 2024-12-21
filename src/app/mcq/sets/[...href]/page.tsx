import MCQApp from "@/app/ui/MCQApp";
import { checkNormalUserAuth, checkAdminUserAuth } from "@/serverFuncs/checkUserAuth";
import { HREF_LOOKUP_MAP } from "@/types";
import { notFound } from "next/navigation";
import shuffle from "lodash/shuffle";
import range from "lodash/range";
import sampleSize from "lodash/sampleSize";

export default async function MCQQuestionsPage({
   params
}: {
   params: Promise<{ 
      href: string[]
   }>
}) {

   const { href } = await params;

   const match = HREF_LOOKUP_MAP["/mcq/sets/" + href.join("/")];

   if (!match) return notFound();

   const { cat, titleName, set, requiresAuth, requiresAdminAuth, isTracked } = match;
   const { qnNumRange, name } = set;

   let userName = "";

   if (requiresAdminAuth) {
      userName = (await checkAdminUserAuth()).given_name || "";
   } else if (requiresAuth) {
      userName = (await checkNormalUserAuth()).given_name || "";
   }

   return <MCQApp
      qnCategory={cat}
      qnNumArray={
         name === "Random" 
         ?  shuffle(sampleSize(range(...qnNumRange), 50)) 
         :  shuffle(range(...qnNumRange))
      }
      userName={userName}
      title={titleName + " - " + name}
      trackQns={isTracked}
      isSetRandom={name === "Random"}
   />
}