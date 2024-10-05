import styled, { keyframes } from "styled-components";

export default function QnSentenceFormatter({
   sentence,
   wordToTest,
}: {
   sentence: string;
   wordToTest: string | null;
}) {
   if ( wordToTest && sentence.includes(wordToTest) ) {
      const beginning = sentence.indexOf(wordToTest);
      const end = beginning + wordToTest.length;

      return (
         <TypingAnim 
            sentence={sentence}
            boldRange={[beginning, end]}
         />
      );
   } else {
      return <TypingAnim sentence={sentence} />;
   }
};

function TypingAnim({ 
   sentence,
   boldRange
}: { 
   sentence: string
   boldRange?: [number, number]
}){
   return (
      <TypingAnimContainer>
         {sentence.split('').map((char, idx) => (
            <TypingAnimChar 
               key={idx} 
               $index={idx}
               $isBold={boldRange
                  ? (idx >= boldRange[0]) && (idx < boldRange[1])
                  : false
               }
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