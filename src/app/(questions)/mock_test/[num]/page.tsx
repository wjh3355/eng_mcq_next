import MockTest from "@/components/mock-test/MockTest";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import { fetchNumMockTests } from "@/lib/mongodb/mt-server-actions";

// export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
   const numMT = await fetchNumMockTests();
   if (typeof numMT !== "number") {
      return [];
   }

   return Array.from({ length: numMT }, (_, i) => i + 1)
      .map(clozeNum => ({ num: clozeNum.toString() }));
}

export default async function IndividualMockTestPage({ params }: { params: Promise<{ num: string }> }) {
   const user = await checkAuthForRoute();

   const MTnum = parseInt((await params).num, 10);

   return <MockTest MTnum={MTnum} user={user} />;
}