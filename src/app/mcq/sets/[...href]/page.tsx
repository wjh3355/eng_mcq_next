import MCQApp from "@/app/ui/MCQApp";
import { checkNormalUserAuth } from "@/serverFuncs/checkUserAuth";
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

   const user = await checkNormalUserAuth();

   const { href } = await params;

   const match = HREF_LOOKUP_MAP["/mcq/sets/" + href.join("/")];

   if (!match) return notFound();

   const { cat, categoryName, set: { qnNumRange, setName } } = match;

   return <MCQApp
      qnCategory={cat}
      qnNumArray={
         setName === "Random" 
         ?  shuffle(sampleSize(range(...qnNumRange), 50)) 
         :  shuffle(range(...qnNumRange))
      }
      userName={user.given_name!}
      title={categoryName + " - " + setName}
      isSetRandom={setName === "Random"}
   />
}