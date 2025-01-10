import ClozeApp from "@/components/cloze/ClozeApp";
import { fetchNumClozes } from "@/utils/clozeActions";
import getUserDataHeaders from "@/utils/getUserDataHeaders";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ num: string }> }) {
   const { kindeUserGivenName } = await getUserDataHeaders();

   const qnNumInt = parseInt((await params).num, 10);
   const numOfClozes = await fetchNumClozes();

   if (!(qnNumInt >= 1 && qnNumInt <= numOfClozes)) notFound();

   return <ClozeApp 
      userName={kindeUserGivenName} 
      qnNum={qnNumInt}
      isDemo={false}
      mainTitle={`Comprehension Cloze - Q${qnNumInt}`}
   />
}