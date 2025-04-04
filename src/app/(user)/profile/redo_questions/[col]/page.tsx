import QuestionApp from "@/components/question/QuestionApp";
import { Collections, QN_COL_DATA } from "@/definitions";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import { notFound } from "next/navigation";

type StaticParams = { col: Collections }

export default async function RedoWrongQuestionsPage({ params }: { params: Promise<StaticParams> }) {
   const user = await checkAuthForRoute();
   const { col } = await params;
   const wrongQnNumsArr = user.qnData[col].wrongQnNums;

   if (wrongQnNumsArr.length === 0) notFound();

   const { categoryName } = QN_COL_DATA[col];

   return <QuestionApp
      title={categoryName + " - Redo Wrong Questions"} 
      qnNumArray={wrongQnNumsArr}
      collection={col}
      email={null}
      nextSetNum={null}
      isThisSetRandom={false}
      isRedoWrongQns={true}
   />

}