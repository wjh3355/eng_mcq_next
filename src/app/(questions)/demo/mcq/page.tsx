import MCQApp from "@/components/mcq/MCQApp";
import shuffle from "lodash/shuffle";
import range from "lodash/range";
import { DEMO_DATA } from "@/definitions";

export default function DemoQnsPage() {

   return <MCQApp
      qnCategory={"demo"}
      qnNumArray={shuffle(range(...DEMO_DATA.qnNumRange))}
      email=""
      title={"Demo MCQ Questions"}
      isSetRandom={false}
      isRedo={false}
   />
}