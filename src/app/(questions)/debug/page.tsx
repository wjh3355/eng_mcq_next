import GenericMCQApp from "@/app/ui/GenericMCQApp";
import checkAdminUserAuth from "@/lib/checkAdminUserAuth";

export default async function Page() {

   const user = await checkAdminUserAuth();

   return <GenericMCQApp
      slug={undefined}
      qnCategory={"debug"}
      userName={user.given_name || "unknown user (no firstName)"}
      headerOverride="FOR DEBUG PURPOSES ONLY"
   />;
}