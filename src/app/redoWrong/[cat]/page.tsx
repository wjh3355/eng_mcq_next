import checkNormalUserAuth from "@/lib/checkNormalUserAuth";
import fetchUserData from "@/lib/fetchUserData";
import { CurrentQnCategoriesTracked, QN_CATEGORIES_DATA } from "@/types";
import { notFound } from "next/navigation";
import QuestionsApp from "@/app/ui/QuestionsApp";

export default async function RedoWrongQnsPage({ params }: { params: Promise<{ cat: CurrentQnCategoriesTracked }> }) {

   const { cat } = await params;
   const user = await checkNormalUserAuth();
   const wrongQnNums = (await fetchUserData(user.given_name!))
      .qnData[cat]?.wrongQnNums || [];

   if (wrongQnNums.length === 0) notFound();

   return <QuestionsApp
      qnCategory={cat}
      qnNumArray={wrongQnNums}
      userName=""
      trackQns={false}
      title={QN_CATEGORIES_DATA[cat].name + " - Incorrect Questions"}
   />
}