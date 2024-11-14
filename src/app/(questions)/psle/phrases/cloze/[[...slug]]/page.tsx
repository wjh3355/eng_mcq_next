import GenericMCQApp from "@/app/ui/GenericMCQApp";
import checkNormalUserAuth from "@/lib/checkNormalUserAuth";

export default async function Page() {

   const user = await checkNormalUserAuth();

   return <GenericMCQApp 
      qnCategory="pslePhrasesCloze"
      userName={user.given_name} />;
}