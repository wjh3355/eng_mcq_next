import MCQApp from "@/components/mcq/MCQApp";
import { QN_CATEGORIES_DATA, qnCategoriesArray, McqCategory } from '@/definitions';
import { notFound } from "next/navigation";
import shuffle from "lodash/shuffle";
import range from "lodash/range";
import sampleSize from "lodash/sampleSize";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import { fetchNumQns } from "@/lib/mongodb/shared-server-actions";
import toast from "react-hot-toast";

type StaticParams = {
   category: McqCategory,
   setParam: string
}

export const dynamicParams = false;

export async function generateStaticParams() {
   let staticParamsArray: StaticParams[] = [];

   for (const category of qnCategoriesArray) {
      
      const totalNumQns = await fetchNumQns(category);
      if (typeof totalNumQns !== "number") return [];

      const { setSize } = QN_CATEGORIES_DATA[category];
      const numPossibleSets = Math.ceil(totalNumQns / setSize);

      const setParamForCat = range(1, numPossibleSets+1)
         .map(num => num.toString())
      
      setParamForCat.push("random", "in-order");

      if (category === "phrasalVerbs") {
         setParamForCat.push("common")
      }

      staticParamsArray.push(...setParamForCat.map(param => ({ category, setParam: param })))
   }
   return staticParamsArray;
}

export default async function MCQSetsPage({ params }: { params: Promise<StaticParams> }) {
   
   const user = await checkAuthForRoute();
   const { category, setParam } = await params;
   
   const totalNumQns = await fetchNumQns(category);
   if (typeof totalNumQns !== "number") {
      toast.error(totalNumQns.error);
      return;
   }   

   const allQnNumsRange = range(1, totalNumQns + 1);

   const catData = QN_CATEGORIES_DATA[category];
   if (!catData) notFound();
   const { setSize, categoryName } = catData

   const numPossibleSets = Math.ceil(totalNumQns / setSize);

   const setAsInteger = parseInt(setParam, 10);

   let qnNumArray: number[] = [];
   let title: string = categoryName + " - ";

   if (category === "phrasalVerbs" && setParam === "common") {
      qnNumArray = shuffle(range(301, 361));
      title += "Commonly Tested"
   } else if (setParam === "random") {
      qnNumArray = sampleSize(allQnNumsRange, 50);
      title += "Random";
   } else if (setParam === "in-order") {
      qnNumArray = allQnNumsRange;
      title += "In Order";
   } else if (setAsInteger >= 1 && setAsInteger <= numPossibleSets) {
      qnNumArray = shuffle(
         allQnNumsRange.slice((setAsInteger - 1)*setSize, (
            setAsInteger*setSize <= totalNumQns 
               ?  setAsInteger*setSize
               :  totalNumQns
         ))
      );
      title += `Set ${setAsInteger}`;
   } else {
      notFound();
   }

   return <MCQApp
      McqCategory={category}
      qnNumArray={qnNumArray}
      email={user.email}
      title={title}
      isSetRandom={setParam === "random"}
      isRedo={false}
   />
}