import QuestionsApp from "@/app/ui/QuestionsApp";
import checkAdminUserAuth from "@/lib/checkAdminUserAuth";
import checkNormalUserAuth from "@/lib/checkNormalUserAuth";
import { HREF_LOOKUP_MAP } from "@/types";
import { notFound } from "next/navigation";
import shuffle from "lodash/shuffle";
import range from "lodash/range";

export default async function QuestionsPage({
   params
}: {
   params: Promise<{ 
      href: string[]
   }>
}) {
   const match = HREF_LOOKUP_MAP["/questions/" + (await params).href.join("/")];

   if (!match) return notFound();

   const { cat, titleName, set, requiresAuth, requiresAdminAuth, isTracked } = match;

   let userName = "";

   if (requiresAdminAuth) {
      userName = (await checkAdminUserAuth()).given_name || "";
   } else if (requiresAuth) {
      userName = (await checkNormalUserAuth()).given_name || "";
   }

   return <QuestionsApp
      qnCategory={cat}
      qnNumArray={shuffle(range(...set.qnNumRange))}
      userName={userName}
      title={
         cat === "debug" 
         ? "DEBUG" 
         : (cat === "demo" 
            ? "Demo Questions" 
            : titleName + " - " + set.name) 
      }
      trackQns={isTracked}
   />
}