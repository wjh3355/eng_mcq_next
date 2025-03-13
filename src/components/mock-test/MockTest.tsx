import { Cloze, Collections, Question } from "@/definitions";
import { fetchCloze } from "@/lib/mongodb/cloze-server-actions";
import { fetchQuestion } from "@/lib/mongodb/question-server-actions";
import MTClientComponent from "./MTClientComponent";

type MockTestProps = {
   questions: Partial<Record<Collections, number[]>>
   clozeNum: number;
}

export default async function MockTest(props: MockTestProps) {
   const { questions, clozeNum } = props;

   let questionObjsArray: Question[] = [];
   let clozeObj: Cloze | { error: string } = { error: "Cloze not found" };

   for (const [collection, qnNums] of Object.entries(questions) as [Collections, number[]][]) {
      const questionsInThisCollection = await fetchQuestion(collection, ...qnNums);
      if ("error" in questionsInThisCollection) {
         throw new Error(questionsInThisCollection.error);
      }
      questionObjsArray.push(...questionsInThisCollection);
   }

   if (clozeNum) {
      clozeObj = await fetchCloze(clozeNum);
   }
   
   if ("error" in clozeObj) {
      throw new Error(clozeObj.error);
   }

   return <MTClientComponent
      questions={questionObjsArray}
      cloze={clozeObj}
   />
}
