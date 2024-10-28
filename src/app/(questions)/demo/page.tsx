import GenericMCQApp from "@/app/ui/GenericMCQApp";

export default function Page() {
   return <GenericMCQApp 
      slug={undefined}
      qnCategory={"demo"}
      userName=""
      headerOverride="Demo Questions"
   />;
}