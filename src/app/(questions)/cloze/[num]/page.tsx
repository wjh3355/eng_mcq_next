import ClozeApp from "@/components/cloze/ClozeApp";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import { fetchCloze, fetchNumClozes } from "@/lib/mongodb/cloze-server-actions";

export const dynamicParams = false;

// export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
   const numOfClozes = await fetchNumClozes();
   if (typeof numOfClozes !== "number") {
      return [];
   }

   return Array.from({ length: numOfClozes }, (_, i) => i + 1)
      .map(clozeNum => ({ num: clozeNum.toString() }));
}

export default async function IndividualClozePage({ params }: { params: Promise<{ num: string }> }) {
   const user = await checkAuthForRoute();

   const qnNumInt = parseInt((await params).num, 10);

   const cloze = await fetchCloze(qnNumInt);

   // TODO: make error handling more graceful!!
   if ('error' in cloze) {
      return null;
   }

   return <ClozeApp 
      user={user} 
      isDemo={false}
      cloze={cloze}
   />
}