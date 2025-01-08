import ClozeApp from "@/components/cloze/ClozeApp";
import { fetchNumClozes } from "@/utils/clozeActions";
import getUserDataHeaders from "@/utils/getUserDataHeaders";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ num: string }> }) {
   const { kindeUserGivenName } = await getUserDataHeaders();

   const int = parseInt((await params).num, 10);
   const numOfClozes = await fetchNumClozes();

   if (!(int >= 1 && int <= numOfClozes)) notFound();

   return <ClozeApp userName={kindeUserGivenName} qnNumToFetch={int}/>
}