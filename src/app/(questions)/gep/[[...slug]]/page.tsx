import GenericMCQApp from "@/app/ui/GenericMCQApp";
import checkNormalUserAuth from "@/lib/checkNormalUserAuth";

export default async function Page({ params }: { params: { slug: string[] | undefined } }) {

   const user = await checkNormalUserAuth();

   return <GenericMCQApp
      slug={params.slug?.join("")}
      qnCategory={"gep"}
      userName={user.given_name!}
   />;
}