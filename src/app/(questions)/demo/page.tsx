import GenericMCQApp from "@/app/ui/GenericMCQApp";
import qnCategoriesData from "@/lib/data";

export default function Page({ params }: { params: { slug: string[] | undefined } }) {
   return <GenericMCQApp 
      slug={params.slug?.join("")}
      qnCategory={qnCategoriesData.demo}
      headerOverride="Demo Questions"
   />;
}