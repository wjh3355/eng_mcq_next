import GenericMCQApp from "@/app/ui/GenericMCQApp";
import checkNormalUserAuth from "@/lib/checkNormalUserAuth";

export default async function Page({ params }: { params: Promise<{ slug: string[] | undefined }>}) {

   const user = await checkNormalUserAuth();

   const { slug } = await params;

   return <GenericMCQApp 
      slug={slug?.join("")}
      qnCategory="pslePhrasesCloze"
      userName={user.given_name} />;
}