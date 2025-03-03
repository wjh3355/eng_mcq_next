import { Question } from '@/definitions';
import Badge from "react-bootstrap/Badge";

export default function QuestionExplanation({ qnObj, num }: { qnObj: Question, num?: number}) {

   const { kindOfQn, sentence, rootWord, wordToTest, def, correctAns, type } = qnObj;

   switch (kindOfQn) {
      case "meaning":
         return (
            <div className="vstack gap-4">
               <div className="fs-5 d-flex align-items-center">
                  <strong className="me-2">
                     {num && `${num}: `}{rootWord}
                  </strong>
                  <Badge bg="info" className="fw-normal">{type}</Badge>
               </div>
               <div className="border-start border-5 border-dark ps-2">
                  {def}
               </div>
               <div className="p-2 fst-italic bg-secondary bg-opacity-10">
                  {sentence}
               </div>
            </div>
         );
      case "spelling":
         return (
            <div className="vstack gap-4">
               <div className="fs-5 d-flex align-items-center">
                  <strong className="me-2">
                     {num && `${num}: `}{correctAns}
                  </strong>
                  <Badge bg="info" className="fw-normal">{type}</Badge>
               </div>
               <div className="border-start border-5 border-dark ps-2">
                  {def}
               </div>
               <div className="p-2 fst-italic bg-secondary bg-opacity-10">
                  {sentence}
               </div>
            </div>
         );
      case "definition":
         return (
            <div className="vstack gap-4">
               <div className="fs-5 d-flex align-items-center">
                  <strong className="me-2">
                     {num && `${num}: `}{correctAns}
                  </strong>
                  <Badge bg="info" className="fw-normal">{type}</Badge>
               </div>
               <div className="border-start border-5 border-dark ps-2">
                  {def}
               </div>
               <div className="p-2 fst-italic bg-secondary bg-opacity-10">
                  {sentence}
               </div>
            </div>
         );
      case "blank":
         return (
            <div className="vstack gap-4">
               <div className="fs-5 d-flex align-items-center">
                  <strong className="me-2">
                     {num && `${num}: `}{rootWord}
                  </strong>
                  <Badge bg="info" className="fw-normal">{type}</Badge>
               </div>
               <div className="border-start border-5 border-dark ps-2">
                  {def}
               </div>
               <div className="p-2 fst-italic bg-secondary bg-opacity-10">
                  {sentence.replace(/_+/g, rootWord!)}
               </div>
            </div>
         );
      default:
         throw new Error("Invalid question kind");
   }
}