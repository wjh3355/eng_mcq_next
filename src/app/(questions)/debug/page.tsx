import GenericMCQApp from "@/app/ui/GenericMCQApp";
import checkAdminUserAuth from "@/lib/checkAdminUserAuth";

export default async function Page() {

   await checkAdminUserAuth();

   return <GenericMCQApp
      slug={undefined}
      qnCategory={"debug"}
      headerOverride="debug"
   />;
}