"use client";

import { Question } from "@/definitions";
import { QuestionState } from "./MTClientComponent";
import Col from "react-bootstrap/esm/Col";
import Card from "react-bootstrap/esm/Card";
import styled from "styled-components";


function SentenceDisp({ qnObj, num }: { qnObj: Question, num: number }) {
   const { kindOfQn, sentence, wordToTest, def } = qnObj;

   switch (kindOfQn) {
      case "meaning":
      case "spelling":

         const [bef, aft] = sentence.split(new RegExp(`\\b${wordToTest!}\\b`));
         return <><strong>{`Q${num}. `}</strong>{bef}<strong>{wordToTest}</strong>{aft}</>;

      case "definition": return <><strong>{`Q${num}. `}</strong>{def}</>;

      case "blank": return <><strong>{`Q${num}. `}</strong>{sentence}</>;

      default: throw new Error("Invalid question kind");
   }
};

export default function MTQuestion({
   thisQnState,
   currentPage,
   handleNextClick,
   handlePreviousClick,
   handleQuestionTouched,
   handleQnReset,
   hasBeenSubmitted
}: {
   thisQnState: QuestionState;
   currentPage: number;
   handleNextClick: () => void;
   handlePreviousClick: () => void;
   handleQuestionTouched: (newAns: string) => void;
   handleQnReset: () => void;
   hasBeenSubmitted: boolean;
}) {

   const {
      mockTestQnNum,
      qnObj,
      answer,
      status
   } = thisQnState;

   const {
      kindOfQn,
      options,
      correctAns
   } = qnObj;

   // only display the question if it is the current page
   if (currentPage !== mockTestQnNum) return null;

   return (
      <>
         <Col lg={8} md={7}>
            <Card className="mb-3 shadow border-0">
               <Card.Body>
                  <SentenceDisp qnObj={qnObj} num={mockTestQnNum}/>
               </Card.Body>
            </Card>
         </Col>
         <Col lg={4} md={5}>

            {
               kindOfQn === "spelling"

               ?  <label>
                     The correct spelling should be:
                     <MTSpellingInput
                        disabled={hasBeenSubmitted}
                        $status={status}
                        type="text"
                        value={answer}
                        autoComplete="off"
                        autoFocus={true}
                        onChange={(e) => e.target.value 
                           ?  handleQuestionTouched(e.target.value) 
                           :  handleQnReset()
                           // initial answer is empty string
                           // if user types something, 
                           // set the answer and status to "done"
                           // if user deletes everything, 
                           // reset the answer and status to "not done"
                        }
                        aria-label={`Answer for question ${mockTestQnNum}`}
                     />
                  </label>

               :  options!.map((option, idx) =>
                     <label 
                        key={idx} 
                        className={`d-block ${hasBeenSubmitted && option === correctAns && "text-success fw-bold"} ${hasBeenSubmitted && answer === option && option !== correctAns && "text-danger fw-bold"}`}
                     >
                        <input
                           disabled={hasBeenSubmitted}
                           type="radio"
                           id={option}
                           name="options"
                           value={option}
                           checked={answer === option}
                           onChange={(e) => handleQuestionTouched(e.target.value)}
                           onClick={(e) => 
                              (answer === (e.target as HTMLInputElement).value) && handleQnReset()
                              // if there isnt anything selected and the user selects an option, 
                              // set the answer and status to "done"
                              // if an option is already selected and the user selects something else,
                              // set the answer and status to "done" for the new option
                              // if the user selects the same option again, 
                              // reset the answer and status to "not done"

                              // at first answer = ""
                              // check is false for all
                              // when user selects an option,
                              // answer === option for that option only
                              // so that one is checked
                           }
                           aria-label={`Answer for question ${mockTestQnNum}`}
                        />
                        &nbsp;{option}
                     </label>
                  )
            }

            <div>
               {hasBeenSubmitted && status === "correct" && <small className="text-success fw-bold">Correct!</small>}
               {hasBeenSubmitted && status === "incorrect" && (
                  answer
                  ?  <small className="text-danger fw-bold">Incorrect!</small>
                  :  <small className="text-danger fw-bold">Did not attempt!</small>
               )}
            </div>

         </Col>
         <Col>
            <button
               disabled={currentPage === 1}
               onClick={handlePreviousClick}
            >
               Previous
            </button>
            <button
               onClick={handleNextClick}
            >
               Next
            </button>
         </Col>
      </>
   );

}

const MTSpellingInput = styled.input<{
   $status: "correct" | "incorrect" | "not done" | "done";
}>`
   width: 250px;
   height: 40px;
   text-align: center;
   border: 2px solid lightgray;
   border-radius: 5px;
   background-color: white;
   font-size: 18px;
   &:disabled {
      ${({$status}) => $status === "correct" && "color: green; font-weight: bold; border-color: green;"}
      ${({$status}) => $status === "incorrect" && "color: rgb(190, 44, 44); font-weight: bold; border-color: rgb(190, 44, 44);"}
   }
`;