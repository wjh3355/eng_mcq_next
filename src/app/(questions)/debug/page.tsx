import GenericMCQApp from "@/app/ui/GenericMCQApp";
import checkAdminUserAuth from "@/lib/checkAdminUserAuth";

export const dynamic = 'force-dynamic';

export default async function Page() {

   await checkAdminUserAuth();

   return <GenericMCQApp
      slug="foo"
      qnCategory="debug"
      header="DEBUG"
   />;
}