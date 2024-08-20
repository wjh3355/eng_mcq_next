export default function SentenceFormatter({
   sentence,
   wordToTest,
   fontSize = '1rem'
}: {
   sentence: string;
   wordToTest: string | null;
   fontSize?: string
}) {
   if ( wordToTest !== null && sentence.includes(wordToTest)) {
      const idxOfWord = sentence.indexOf(wordToTest);
      return (
         <div style={{fontSize: fontSize}}>
            {sentence.slice(0, idxOfWord)}
            <strong>{wordToTest}</strong>
            {sentence.slice(idxOfWord + wordToTest.length)}
         </div>
      );
   } else {
      return (
         <div style={{fontSize: fontSize}}>
            {sentence}
         </div>
      );
   }
};