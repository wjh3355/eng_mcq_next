import { MCQQnObj } from "@/types";
import MCQReviewSentence from "./MCQReviewSentence";
import Badge from "react-bootstrap/Badge";

export default function DictionaryEntry({ 
   qnObj, 
   num,
   dontShowSentence
}: { 
   qnObj: MCQQnObj, 
   num?: number,
   dontShowSentence?: boolean
}) {
   const { sentence, rootWord, wordToTest, def, correctAns, type } = qnObj;
   return (
      <div className="vstack gap-4">
         <div className="fs-5 d-flex align-items-center">
            <strong className="me-2">
               {num ? `${num}:  ${rootWord}` : rootWord}
            </strong>
            <Badge bg="info" className="fw-normal">{type}</Badge>
         </div>
         <div className="border-start border-5 border-dark ps-2">
            {def}
         </div>
         {!dontShowSentence &&
            <div className="p-2 fst-italic bg-secondary bg-opacity-10">
               <MCQReviewSentence
                  sentence={sentence}
                  wordToTest={wordToTest}
                  correctAns={correctAns}
               />
            </div>
         }
      </div>
   );
}