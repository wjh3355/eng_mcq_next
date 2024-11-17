import checkNormalUserAuth from "@/lib/checkNormalUserAuth";
import fetchUserData from "@/lib/fetchUserData";
import { CurrentQnCategoriesTracked } from "@/types";
import { notFound } from "next/navigation";
import RedoWrongApp from "@/app/ui/RedoWrongApp";

export default async function RedoWrongQnsPage({ params }: { params: Promise<{ cat: CurrentQnCategoriesTracked }> }) {

   const { cat } = await params;
   const user = await checkNormalUserAuth();
   const wrongQnNums = (await fetchUserData(user.given_name!))
      .qnData[cat]?.wrongQnNums || [];

   if (wrongQnNums.length === 0) notFound();

   return <RedoWrongApp cat={cat} wrongQnNums={wrongQnNums}/>
}