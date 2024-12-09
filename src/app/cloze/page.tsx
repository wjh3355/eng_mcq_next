import checkNormalUserAuth from "@/serverFuncs/checkNormalUserAuth";
import ClozeApp from "./ClozeApp";

export const dynamic = 'force-dynamic';

export default async function Page() {
   const user = await checkNormalUserAuth();

   return <ClozeApp userName={user.given_name!}/>
}