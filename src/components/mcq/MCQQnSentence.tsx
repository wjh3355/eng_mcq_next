import styled, { keyframes } from "styled-components";
import range from "lodash/range";

export default function MCQQnSentence({
   sentence,
   wordToTest,
}: {
   sentence: string;
   wordToTest: string | null;
}) {
   if ( wordToTest && sentence.includes(wordToTest) ) {
      const idxsToBeBolded = [...sentence.matchAll(new RegExp(wordToTest, 'g'))]
         .map(match => match.index)
         .reduce<number[]>((acc, curr) => [...acc, ...range(curr, curr + wordToTest.length)], []);

      return (
         <TypingAnim 
            sentence={sentence}
            boldRange={idxsToBeBolded}
         />
      );

   } else {
      return <TypingAnim sentence={sentence} boldRange={[]}/>;
   }
};

function TypingAnim({ 
   sentence,
   boldRange
}: { 
   sentence: string
   boldRange: number[]
}){
   return (
      <TypingAnimContainer>
         {sentence.split('').map((char, idx) => (
            <TypingAnimChar 
               key={idx} 
               $index={idx}
               $isBold={boldRange.includes(idx)}
            >
               {char}
            </TypingAnimChar>
         ))}
      </TypingAnimContainer>
   );
};

const fadeIn = keyframes`
   from { opacity: 0 }
   to { opacity: 1 }
`;

const TypingAnimContainer = styled.div`
   display: block;
   width: 100%;
   overflow: hidden;
   word-break: break-word;
   font-size: 18px
`;

const TypingAnimChar = styled.span<{
   $index: number;
   $isBold: boolean
}>`
   opacity: 0;
   animation: ${fadeIn} 10ms linear forwards;
   animation-delay: ${({$index}) => $index * 10 }ms;
   font-weight: ${({$isBold}) => $isBold ? 'bold' : 'normal' }
`;