export default function SentenceFormatter({
   sentence,
   wordToTest,
}: {
   sentence: string;
   wordToTest: string;
}) {
   if (sentence.includes(wordToTest)) {
      const idxOfWord = sentence.indexOf(wordToTest);
      return (
         <>
            {sentence.slice(0, idxOfWord)}
            <strong>{wordToTest}</strong>
            {sentence.slice(idxOfWord + wordToTest.length)}
         </>
      );
   } else {
      return <>{sentence}</>;
   }
};