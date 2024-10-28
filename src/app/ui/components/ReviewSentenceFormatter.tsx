import React from "react";

export default function ReviewSentenceFormatter({
   sentence,
   wordToTest,
   correctAns,
}: {
   sentence: string;
   wordToTest: string | null;
   correctAns: string;
}) {

   const matcher = wordToTest || /_+/g;

   const parts = sentence.split(matcher);

   const formattedSentence = parts.reduce<(string | React.JSX.Element)[]>(
      (acc, part, idx) => {
         if (idx === parts.length - 1) {
            return [...acc, part];
         } else {
            return [...acc, part, <strong key={idx}>{wordToTest || correctAns}</strong>];
         }
      },
      []
   );

   return <div>{formattedSentence}</div>;
};