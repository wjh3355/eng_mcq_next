import { split } from "lodash";

export default function SentenceFormatter({
   sentence,
   wordToTest,
   correctAns = null,
   fontSize = '1rem'
}: {
   sentence: string;
   wordToTest: string | null;
   correctAns?: string | null;
   fontSize?: string
}) {
   const fontSizeStyle = {fontSize: fontSize}

   if ( wordToTest && sentence.includes(wordToTest) ) {
      const [beginning, end] = split(sentence, wordToTest, 2);
      return (
         <div style={fontSizeStyle}>

            {beginning}
            <strong>{wordToTest}</strong>
            {end}

         </div>
      );
   } else if ( correctAns && sentence.includes('_') ) {
      const [beginning, end] = split(sentence, /_+/g, 2);
      return (
         <div style={fontSizeStyle}>

            {beginning}
            <strong>{correctAns}</strong>
            {end}

         </div>
      );
   } else {
      return (
         <div style={fontSizeStyle}>
            {sentence}
         </div>
      );
   }
};