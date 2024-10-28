import GenericMCQApp from "@/app/ui/GenericMCQApp";
import checkUserAuth from "@/lib/checkUserAuth";

export default async function Page({ params }: { params: { slug: string[] | undefined } }) {

   const user = await checkUserAuth();

   return <GenericMCQApp 
      slug={params.slug?.join("")}
      qnCategory={"psleWordsMcq"}
      userName={user.given_name || "unknown user (no firstName)"}
   />;
}