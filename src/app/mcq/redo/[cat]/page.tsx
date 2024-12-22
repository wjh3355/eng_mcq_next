import { checkNormalUserAuth } from "@/serverFuncs/checkUserAuth";
import fetchUserData from "@/serverFuncs/fetchUserData";
import { QnCategory, QN_CATEGORIES_DATA } from "@/types";
import { notFound } from "next/navigation";
import MCQApp from "@/app/ui/MCQApp";

export default async function RedoWrongQnsPage({ params }: { params: Promise<{ cat: QnCategory }> }) {

   const { cat } = await params;
   const user = await checkNormalUserAuth();
   const wrongQnNums = (await fetchUserData(user.given_name!))
      .qnData[cat]?.wrongQnNums || [];

   if (wrongQnNums.length === 0) notFound();

   return <MCQApp
      qnCategory={cat}
      qnNumArray={wrongQnNums}
      userName=""
      title={QN_CATEGORIES_DATA[cat].categoryName + " - Incorrect Questions"}
      isSetRandom={false}
   />
}