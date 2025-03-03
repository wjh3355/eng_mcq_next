import shuffle from "lodash/shuffle";
import range from "lodash/range";
import QuestionApp from "@/components/question/QuestionApp";
import { fetchNumOfQnsInCollection } from "@/lib/mongodb/new-server-action";
import toast from "react-hot-toast";

export default async function DemoQnsPage() {

   const numOfDemoQns = await fetchNumOfQnsInCollection("demo");
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