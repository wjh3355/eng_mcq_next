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
      const [beginning, end] = sentence.split(wordToTest);
      return (
         <>
            {beginning}<strong className="text-danger">{wordToTest}</strong>{end}
         </>
      );
   } else if (sentence.includes('_')) {
      const [beginning, end] = sentence.split(/_+/g);
      return (
         <>
            {beginning}<strong className="text-danger">{correctAns}</strong>{end}
         </>
      );
   } else {
      return <>{sentence}</>;
   };
};