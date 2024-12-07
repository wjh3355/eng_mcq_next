import checkNormalUserAuth from "@/serverFuncs/checkNormalUserAuth";
import ClozeApp from "./ClozeApp";

export const dynamic = 'force-dynamic';

export default async function Page() {
   await checkNormalUserAuth();

   return <ClozeApp/>
}