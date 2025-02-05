import ClozeApp from "@/components/cloze/ClozeApp";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import { fetchNumQns } from "@/lib/mongodb/get-qns-server";
import { range } from "lodash";

export const dynamicParams = false;

// export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
   const numOfClozes = await fetchNumQns("clozePassage");

   return range(1, numOfClozes+1)
      .map(clozeNum => ({ num: clozeNum.toString() }));
}

export default async function IndividualClozePage({ params }: { params: Promise<{ num: string }> }) {
   const user = await checkAuthForRoute();

   const qnNumInt = parseInt((await params).num, 10);

   return <ClozeApp 
      user={user} 
      qnNum={qnNumInt}
      isDemo={false}
      mainTitle={`Comprehension Cloze - Q${qnNumInt}`}
   />
}