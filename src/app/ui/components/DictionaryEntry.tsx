import { QnObj } from "@/types";
import ReviewSentenceFormatter from "./ReviewSentenceFormatter";
import Badge from "react-bootstrap/Badge";

export default function DictionaryEntry({ qnObj, num }: { qnObj: QnObj, num?: number }) {
   const { sentence, rootWord, wordToTest, def, correctAns, type } = qnObj;
   return (
      <div>
         <div className="fs-5 d-flex align-items-center">
            <strong className="me-2">
               {num ? `${num}:  ${rootWord}` : rootWord}
            </strong>
            <Badge bg="info" className="fw-normal">{type}</Badge>
         </div>
         <div className="border-start border-5 border-dark ps-2 my-4">
            {def}
         </div>
         <div className="p-2 fst-italic bg-secondary bg-opacity-10 d-flex">
            <ReviewSentenceFormatter
               sentence={sentence}
               wordToTest={wordToTest}
               correctAns={correctAns}
            />
         </div>
      </div>
   );
}