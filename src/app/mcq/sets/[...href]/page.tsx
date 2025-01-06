import MCQApp from "@/app/ui/MCQApp";
import { checkNormalUserAuth } from "@/serverFuncs/checkUserAuth";
import { HREF_LOOKUP_MAP } from "@/types";
import { notFound } from "next/navigation";
import shuffle from "lodash/shuffle";
import range from "lodash/range";
import sampleSize from "lodash/sampleSize";

export default async function MCQQuestionsPage({ params }: { params: Promise<{ href: string[] }> }) {
   const user = await checkNormalUserAuth();
   const match = HREF_LOOKUP_MAP["/mcq/sets/" + (await params).href.join("/")];
   if (!match) return notFound();

   const { cat, categoryName, set: { qnNumRange, setName } } = match;

   let qnNumArray: number[] = [];
   if (typeof setName === "number") {
      qnNumArray = shuffle(range(...qnNumRange));
   } else if (setName === "Random") {
      qnNumArray = shuffle(sampleSize(range(...qnNumRange), 50));
   } else if (setName === "In Order") {
      qnNumArray = range(...qnNumRange);
   }

   return <MCQApp
      qnCategory={cat}
      qnNumArray={qnNumArray}
      userName={user.given_name!}
      title={categoryName 
         + " - " 
         + (typeof setName === "number" ? `Set ${setName}` : setName)
      }
      isSetRandom={setName === "Random"}
      isRedo={false}
   />
}