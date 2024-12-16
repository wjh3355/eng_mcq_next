import checkNormalUserAuth from "@/serverFuncs/checkNormalUserAuth";
import ClozeApp from "../ClozeApp";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ num: number }> }) {
   const user = await checkNormalUserAuth();

   const { num } = await params;

   return <ClozeApp userName={user.given_name!} qnNumToFetch={Number(num)}/>
}