"use server";

import { QnCategory, QN_CATEGORIES_DATA } from '@/definitions';
import { notFound } from "next/navigation";
import MCQApp from "@/components/mcq/MCQApp";
import { checkAuthForRoute } from '@/lib/auth/checkAuthForRoute';

export default async function RedoWrongQnsPage({ params }: { params: Promise<{ category: QnCategory }> }) {

   const { category } = await params;
   const user = await checkAuthForRoute();
   const wrongQnNums = user.qnData[category]?.wrongQnNums || [];

   if (wrongQnNums.length === 0) notFound();

   return <MCQApp
      qnCategory={category}
      qnNumArray={wrongQnNums}
      email=""
      title={QN_CATEGORIES_DATA[category].categoryName + " - Incorrect Questions"}
      isSetRandom={false}
      isRedo={true}
   />
}