import MCQApp from "@/components/mcq/MCQApp";
import shuffle from "lodash/shuffle";
import range from "lodash/range";
import { DEMO_DATA } from "@/types";

export default function DemoQnsPage() {

   return <MCQApp
      qnCategory={"demo"}
      qnNumArray={shuffle(range(...DEMO_DATA.qnNumRange))}
      userName={""}
      title={"Demo MCQ Questions"}
      isSetRandom={false}
      isRedo={false}
   />
}