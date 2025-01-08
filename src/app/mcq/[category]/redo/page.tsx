import fetchUserData from "@/utils/fetchUserData";
import { QnCategory, QN_CATEGORIES_DATA } from "@/types";
import { notFound } from "next/navigation";
import MCQApp from "@/components/mcq/MCQApp";
import getUserDataHeaders from "@/utils/getUserDataHeaders";

export default async function RedoWrongQnsPage({ params }: { params: Promise<{ category: QnCategory }> }) {

   const { category } = await params;
   const { kindeUserGivenName } = await getUserDataHeaders();
   const wrongQnNums = (await fetchUserData(kindeUserGivenName))
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