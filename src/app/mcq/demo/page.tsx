import MCQApp from "@/app/ui/MCQApp";
import shuffle from "lodash/shuffle";
import range from "lodash/range";

export default async function DemoQnsPage() {
   return <MCQApp
      qnCategory={"demo"}
      qnNumArray={shuffle(range(1, 61))}
      userName={""}
      title={"Demo MCQ Questions"}
      isSetRandom={false}
   />
}