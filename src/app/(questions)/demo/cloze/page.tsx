import ClozeApp from "@/components/cloze/ClozeApp";
import { EMPTY_USER } from "@/definitions";

export default function DemoClozePage() {

   return <ClozeApp
      qnNum={1}
      user={EMPTY_USER}
      isDemo={true}
      mainTitle="Demo Comprehension Cloze"
   />
}