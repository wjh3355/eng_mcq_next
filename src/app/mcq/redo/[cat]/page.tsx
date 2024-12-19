import checkNormalUserAuth from "@/serverFuncs/checkNormalUserAuth";
import fetchUserData from "@/serverFuncs/fetchUserData";
import { CurrentQnCategoriesTracked, QN_CATEGORIES_DATA } from "@/types";
import { notFound } from "next/navigation";
import MCQApp from "@/app/ui/MCQApp";

export default async function RedoWrongQnsPage({ params }: { params: Promise<{ cat: CurrentQnCategoriesTracked }> }) {

   const { cat } = await params;
   const user = await checkNormalUserAuth();
   const wrongQnNums = (await fetchUserData(user.given_name!))
      .qnData[cat]?.wrongQnNums || [];

   if (wrongQnNums.length === 0) notFound();

   return <MCQApp
      qnCategory={cat}
      qnNumArray={wrongQnNums}
      userName=""
      trackQns={false}
      title={QN_CATEGORIES_DATA[cat].name + " - Incorrect Questions"}
      isSetRandom={false}
   />
}