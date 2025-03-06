import shuffle from "lodash/shuffle";
import range from "lodash/range";
import QuestionApp from "@/components/question/QuestionApp";
import { fetchNumQuestions } from "@/lib/mongodb/question-server-actions";
import toast from "react-hot-toast";

export default async function DemoQnsPage() {

   const numOfDemoQns = await fetchNumQuestions("demo");
   if (typeof numOfDemoQns !== 'number') {
      toast.error(numOfDemoQns.error);
      return;
   }

   const qnNumArray = shuffle(range(1, numOfDemoQns + 1));

   return <QuestionApp
      collection='demo'
      qnNumArray={qnNumArray}
      email=''
      title={'Demo Questions'}
      nextSetNum={null}
      isThisSetRandom={false}
   />
}