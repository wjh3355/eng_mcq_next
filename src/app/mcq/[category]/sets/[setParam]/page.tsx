import MCQApp from "@/app/ui/MCQApp";
import { QN_CATEGORIES_DATA, QnCategory } from "@/types";
import { notFound } from "next/navigation";
import shuffle from "lodash/shuffle";
import range from "lodash/range";
import sampleSize from "lodash/sampleSize";
import { fetchNumQns } from "@/serverFuncs/qnActions";
import getUserDataHeaders from "@/serverFuncs/getUserDataHeaders";

export default async function MCQQuestionsPage({ params }: { params: Promise<{ category: QnCategory, setParam: string }> }) {
   
   const { kindeUserGivenName } = await getUserDataHeaders();
   const { category, setParam } = await params;
   const totalNumQns = await fetchNumQns(category);

   const allQnNumsRange = range(1, totalNumQns + 1);

   const catData = QN_CATEGORIES_DATA[category];
   if (!catData) notFound();

   const numPossibleSets = Math.floor(totalNumQns / catData.setSize);

   const setAsInteger = parseInt(setParam, 10);

   let qnNumArray: number[] = [];
   let title: string = catData.categoryName + " - ";

   if (setParam === "random") {
      qnNumArray = sampleSize(allQnNumsRange, 50);
      title += "Random";
   } else if (setParam === "in_order") {
      qnNumArray = allQnNumsRange;
      title += "In Order";
   } else if (setAsInteger >= 1 && setAsInteger <= numPossibleSets) {
      qnNumArray = shuffle(
         allQnNumsRange.slice((setAsInteger - 1)*catData.setSize, setAsInteger*catData.setSize)
      );
      title += `Set ${setAsInteger}`;
   } else {
      notFound();
   }

   return <MCQApp
      qnCategory={category}
      qnNumArray={qnNumArray}
      userName={kindeUserGivenName}
      title={title}
      isSetRandom={setParam === "random"}
      isRedo={false}
   />
}