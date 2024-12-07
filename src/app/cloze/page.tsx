import checkNormalUserAuth from "@/serverFuncs/checkNormalUserAuth";
import ClozeApp from "./ClozeApp";

export default async function Page() {
   await checkNormalUserAuth();

   return <ClozeApp/>
}