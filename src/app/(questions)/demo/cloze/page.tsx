import ClozeApp from "@/components/cloze/ClozeApp";
import { EMPTY_USER } from "@/definitions";
import { fetchCloze } from "@/lib/mongodb/cloze-server-actions";

export default async function DemoClozePage() {

   const demoCloze = await fetchCloze(1);

   if ('error' in demoCloze) {
      // TODO: more elegant error handling!!!!
      return <pre>error</pre>
   }

   return <ClozeApp
      cloze={demoCloze}
      user={EMPTY_USER}
      isDemo={true}
   />
}