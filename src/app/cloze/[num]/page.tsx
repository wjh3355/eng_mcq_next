import ClozeApp from "@/app/ui/ClozeApp";
import getUserDataHeaders from "@/serverFuncs/getUserDataHeaders";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ num: number }> }) {
   const { kindeUserGivenName } = await getUserDataHeaders();

   const { num } = await params;

   return <ClozeApp userName={kindeUserGivenName} qnNumToFetch={Number(num)}/>
}