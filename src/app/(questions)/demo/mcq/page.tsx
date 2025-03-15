import shuffle from "lodash/shuffle";
import QuestionApp from "@/components/question/QuestionApp";
import { fetchNumQuestions } from "@/lib/mongodb/question-server-actions";
import toast from "react-hot-toast";

export default async function DemoQnsPage() {

   const numOfDemoQns = await fetchNumQuestions("demo");
   if (typeof numOfDemoQns !== 'number') {
      toast.error(numOfDemoQns.error);
      return;
   }

   const qnNumArray = shuffle(Array.from({ length: numOfDemoQns }, (_, i) => i + 1));

   return <QuestionApp
      collection='demo'
      qnNumArray={qnNumArray}
      email=''
      title={'Demo Questions'}
      nextSetNum={null}
      isThisSetRandom={false}
   />
}