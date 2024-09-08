import { split } from "lodash";

export default function ReviewSentenceFormatter({
   sentence,
   wordToTest,
   correctAns,
}: {
   sentence: string;
   wordToTest: string | null;
   correctAns: string;
}) {

   if ( wordToTest && sentence.includes(wordToTest) ) {
      const [beginning, end] = split(sentence, wordToTest, 2);
      return (
         <>
            {beginning}
            <strong>{wordToTest}</strong>
            {end}
         </>
      );
   } else if (sentence.includes('_')) {
      const [beginning, end] = split(sentence, /_+/g, 2);
      return (
         <>
            {beginning}
            <strong>{correctAns}</strong>
            {end}
         </>
      );
   } else {
      return <>{sentence}</>;
   };
};