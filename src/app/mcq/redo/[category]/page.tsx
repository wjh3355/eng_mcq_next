import { checkNormalUserAuth } from "@/serverFuncs/checkUserAuth";
import fetchUserData from "@/serverFuncs/fetchUserData";
import { QnCategory, QN_CATEGORIES_DATA } from "@/types";
import { notFound } from "next/navigation";
import MCQApp from "@/app/ui/MCQApp";

export default async function RedoWrongQnsPage({ params }: { params: Promise<{ category: QnCategory }> }) {

   const { category } = await params;
   const user = await checkNormalUserAuth();
   const wrongQnNums = (await fetchUserData(user.given_name!))
      .qnData[category]?.wrongQnNums || [];

   if (wrongQnNums.length === 0) notFound();

   return <MCQApp
      qnCategory={category}
      qnNumArray={wrongQnNums}
      userName=""
      title={QN_CATEGORIES_DATA[category].categoryName + " - Incorrect Questions"}
      isSetRandom={false}
      isRedo={true}
   />
}