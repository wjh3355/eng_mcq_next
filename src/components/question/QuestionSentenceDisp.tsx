import styled, { keyframes } from "styled-components";
import { Question } from "@/definitions";

export default function QuestionSentenceDisp({ qnObj, num }: { qnObj: Question, num: number }) {

   const { kindOfQn, sentence, wordToTest, def } = qnObj;

   switch (kindOfQn) {
      case "meaning":
      case "spelling":

         const regex = new RegExp(`\\b${wordToTest!}\\b`);
         const matchIdx = regex.exec(sentence)!.index;
         const indexes = Array.from({ length: wordToTest!.length }, (_, i) => matchIdx + i);

         return <TypingAnim 
            sentence={sentence}
            boldRange={indexes}
            num={num}
         />;
      case "definition":
         return <TypingAnim sentence={def!} boldRange={[]} num={num}/>;
      case "blank":
         return <TypingAnim sentence={sentence} boldRange={[]} num={num}/>;
      default:
         throw new Error("Invalid question kind");
   }
};

function TypingAnim({ 
   sentence,
   boldRange,
   num
}: { 
   sentence: string
   boldRange: number[]
   num: number
}){
   return (
      <TypingAnimContainer>
         {`Q${num}. `}
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
   animation-delay: ${({$index}) => $index * 12 }ms;
   font-weight: ${({$isBold}) => $isBold ? 'bold' : 'normal' }
`;