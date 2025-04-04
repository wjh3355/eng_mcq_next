import QuestionApp from "@/components/question/QuestionApp";
import { Collections, QN_COL_DATA, questionCategoriesTuple } from "@/definitions";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import { fetchNumQuestions } from "@/lib/mongodb/question-server-actions";
import { inRange, sampleSize, shuffle } from "lodash";
import { notFound } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

type StaticParams = {
   col: Collections,
   setParam: string
}

export const dynamicParams = false;

export async function generateStaticParams() {
   let staticParamsArray: StaticParams[] = [];

   for (const col of questionCategoriesTuple) {

      if (col === "demo") continue;

      // col = "gep", "phrasalVerbs" ... "definition"
      // no "demo" here. will be in another route
      
      const totalNumQns = await fetchNumQuestions(col);
      // total num of qns in collection
      if (typeof totalNumQns !== "number") return [];

      const { setSize } = QN_COL_DATA[col];
      // 100, 50 or 30 etc
   
      const numPossibleSets = Math.ceil(totalNumQns / setSize);
      // eg. if 123 questions and setSize = 50
      // we get 2 sets of 50, 1 set of 23
      // total 3

      const setParamForCat = Array
         .from({ length: numPossibleSets }, (_, i) => i + 1)
         .map(num => num.toString());
      // if there are 5 sets, we get ["1", "2", "3", "4", "5"]

      setParamForCat.push("random", "in-order");

      staticParamsArray.push(...setParamForCat.map(setParam => ({ col, setParam })));
   }

   return staticParamsArray;
}

export default async function QuestionSetsPage({ params }: { params: Promise<StaticParams> }) {

   const user = await checkAuthForRoute();
   const { col, setParam } = await params;

   // get number of questions in collection
   const totalNumQns = await fetchNumQuestions(col);
   if (typeof totalNumQns !== "number") {
      toast.error(totalNumQns.error);
      return;
   };

   // get all question numbers ([1, 2, 3, 4, 5 ... totalNumQns])
   const allQnNumsRange = Array.from({ length: totalNumQns }, (_, i) => i + 1);

   // get category data
   const { setSize, categoryName } = QN_COL_DATA[col];

   // get number of possible sets
   // eg. if 123 questions and setSize = 50
   // we get 2 sets of 50, 1 set of 23
   // total 3
   const numPossibleSets = Math.ceil(totalNumQns / setSize);

   // if setParam is a number, convert to integer
   const setAsInteger = parseInt(setParam, 10);

   let qnNumArray: number[] = [];
   let title: string = categoryName + " - ";

   if (setParam === "random") {
      // get random sample of questions
      qnNumArray = sampleSize(allQnNumsRange, setSize);
      title += "Random";

   } else if (setParam === "in-order") {
      // get all questions in order
      qnNumArray = allQnNumsRange;
      title += "In Order";

   } else if (inRange(setAsInteger, 1, numPossibleSets + 1)) {
      // get questions for a specific set
      // eg. set 2 for above is [51, 52, 53 ... 100]
      // set 3 is [101, 102, 103 ... 123]
      // shuffle the array
      qnNumArray = shuffle(allQnNumsRange.slice( (setAsInteger-1)*setSize, Math.min(setAsInteger*setSize, totalNumQns) ));
      title += `Set ${setAsInteger}`;

   } else {
      notFound();
   }

   return <QuestionApp
      title={title}
      qnNumArray={qnNumArray}
      collection={col}
      email={user.email}
      nextSetNum={setAsInteger === numPossibleSets ? null : setAsInteger + 1}
      isThisSetRandom={setParam === "random"}
      isRedoWrongQns={false}
   />
}