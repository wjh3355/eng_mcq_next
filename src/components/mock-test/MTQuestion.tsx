"use client";

import { useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Card from "react-bootstrap/esm/Card";
import styled from "styled-components";

import { MTState } from "@/definitions";
import { useMockTestContext } from "./MTProvider";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import QuestionExplanation from "../question/QuestionExplanation";
import { CircleCheck, CircleX } from "lucide-react";

function SentenceDisp({ thisQnState }: { thisQnState: MTState }) {

   if (thisQnState.type !== "question") return null;

   const { kindOfQn, sentence, wordToTest, def } = thisQnState.qnObj;

   switch (kindOfQn) {
      case "meaning":
      case "spelling": {
         const [bef, aft] = sentence.split(new RegExp(`\\b${wordToTest!}\\b`));
         return <><strong>{`Q${thisQnState.qnIndex+1}. `}</strong>{bef}<strong>{wordToTest}</strong>{aft}</>;
      }
      case "definition": return <><strong>{`Q${thisQnState.qnIndex+1}. `}</strong>{def}</>;

      case "blank": return <><strong>{`Q${thisQnState.qnIndex+1}. `}</strong>{sentence}</>;

      default: throw new Error("Invalid question kind");
   }
};

function MTQuestionAnswer({
   thisQnState,
   isMTSubmitted,
   handleTouched,
   handleReset
}: {
   thisQnState: MTState;
   isMTSubmitted: boolean;
   handleTouched: (n: number, v: string) => void;
   handleReset: (n: number) => void;
}) {

   if (thisQnState.type !== "question") return null;

   // qnObj.kindOfQn === "spelling" requires an input field
   // others require radio buttons
   if (thisQnState.qnObj.kindOfQn === "spelling") {

      const { status, qnIndex, answer } = thisQnState;

      // initial answer is empty string
      // if user types something, 
      // set the answer and status to "done"
      // if user deletes everything, 
      // reset the answer and status to "not done"

      // determine the style of the input field
      // default: not submitted yet, or submitted but was blank
      // red: incorrect answer
      // green: correct answer
      let style: 'red' | 'green' | 'default' = 'default';
      if (!isMTSubmitted || status === 'incorrect' && !answer) {
         style = 'default';
      } else if (status === 'correct') {
         style = 'green';
      } else if (status === 'incorrect') {
         style = 'red';
      }

      return (
         <>
            <small className="text-muted mb-2 mx-auto">
               The correct word should be:&ensp;
            </small>
            <div className="position-relative mx-auto">
               <MTSpellingInput
                  disabled={isMTSubmitted}
                  $style={style}
                  type="text"
                  value={answer}
                  autoComplete="off"
                  autoFocus={true}
                  onChange={e => {
                     if (e.target.value) {
                        handleTouched(qnIndex, e.target.value);
                     } else {
                        handleReset(qnIndex);
                     }
                  }}
               />
               {status === 'correct' && 
                  <CircleCheck size={20} strokeWidth={3} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'green' }}/>
               }
               {status === 'incorrect' && answer && 
                  <CircleX size={20} strokeWidth={3} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgb(190, 44, 44)' }}/>
               }
            </div>
         </>
      );

   } else {

      const { status, qnIndex, answer, qnObj } = thisQnState;

      // qnObj.kindOfQn === "meaning" or "blank" only

      const arrayOfRadioButtons = qnObj.options!.map(thisOption => {

         const isGreen = status === "correct" && answer === thisOption;

         const isRed = status === "incorrect" && answer === thisOption;

         // if there isnt anything selected and the user selects an option, 
         // set the answer and status to "done"
         // if an option is already selected and the user selects something else,
         // set the answer and status to "done" for the new option
         // (handled by handleQuestionTouched)
         
         // if the user selects the same option again, 
         // reset the answer and status to "not done"
         // (handled by handleQuestionReset)


         // at first answer = "" so
         // check is false for all
         // when user selects an option,
         // answer === option for that option only
         // so that one is checked

         return (
            <label 
               key={thisOption} 
               className={`d-block d-flex align-items-center ${isGreen ? "text-success fw-bold" : isRed ? "text-danger fw-bold" : ""}`}
            >
               <input
                  id={thisOption}
                  type="radio"
                  name="options"
                  disabled={isMTSubmitted}
                  value={thisOption}
                  checked={answer === thisOption}
                  onChange={e => handleTouched(qnIndex, e.target.value)}
                  onClick={e => (answer === (e.target as HTMLInputElement).value) && handleReset(qnIndex)}
               />
               &nbsp;
               {thisOption}
               &nbsp;
               {isGreen ? <CircleCheck size={17} strokeWidth={3}/> : isRed ? <CircleX size={17} strokeWidth={3}/> : ""}
            </label>
         )
      })

      return (
         <>
            <small className="text-muted mb-2 mx-auto">
               {thisQnState.qnObj.kindOfQn === "meaning" && "Select the word that matches the meaning:"}
               {thisQnState.qnObj.kindOfQn === "blank" && "Select the best word for the blank:"}
            </small>
            <div>
               {arrayOfRadioButtons}
            </div>
         </>
      );
   }
}

export default function MTQuestion() {

   const { 
      testStates,
      currUserPage,
      handleTouched,
      handleReset,
      isMTSubmitted
   } = useMockTestContext();

   const [isExplShown, setIsExplShown] = useState<boolean>(false);

   // find the state for the current question displayed, if any
   // if currUserPage is 1, corresponding qnIndex is 0
   const displayedQnState = testStates.find(st => st.type === "question" && currUserPage - 1 === st.qnIndex);

   if (!displayedQnState || displayedQnState.type !== "question") return null;

   return (
      <>
         <Col lg={8} md={7}>
            <Card className="mb-3 shadow border-0">
               <Card.Body>
                  <SentenceDisp thisQnState={displayedQnState}/>
               </Card.Body>
            </Card>
         </Col>

         <Col lg={4} md={5}>
            <Card className="shadow border-0">
               <Card.Body className="d-flex flex-column justify-content-left">

                  <MTQuestionAnswer
                     thisQnState={displayedQnState}
                     isMTSubmitted={isMTSubmitted}
                     handleTouched={handleTouched}
                     handleReset={handleReset}
                  />

                  {displayedQnState.status === "incorrect" && !displayedQnState.answer &&
                     <small className="text-danger fw-bold mx-auto d-flex align-items-center mt-2"><CircleX size={17} strokeWidth={3}/>&nbsp;Did not attempt</small>
                  }

               </Card.Body>
               
               {isMTSubmitted &&
                  <Card.Footer className="d-flex align-items-center justify-content-evenly">
                     {displayedQnState.status === "incorrect" &&
                        <small className="text-success">Correct answer: <strong>{displayedQnState.qnObj.correctAns}</strong></small>
                     }
                     <Button size="sm" variant="outline-info" onClick={() => setIsExplShown(true)}>
                        Explanation
                     </Button>
                  </Card.Footer>
               }

            </Card>
         </Col>

         <Modal size="lg" centered show={isExplShown} onHide={() => setIsExplShown(false)}>
            <Modal.Header closeButton><Modal.Title className="fs-5">Explanation</Modal.Title></Modal.Header>
            <Modal.Body><QuestionExplanation qnObj={displayedQnState.qnObj}/></Modal.Body>
         </Modal>
      </>
   );
}

const MTSpellingInput = styled.input<{
   $style: "red" | "green" | "default";
}>`
   width: 250px;
   height: 40px;
   margin-left: auto;
   margin-right: auto;
   text-align: center;
   border: 2px solid lightgray;
   border-radius: 5px;
   background-color: white;
   font-size: 18px;
   &:disabled {
      ${({$style}) => $style === "green" && "color: green; font-weight: bold; border-color: green;"}
      ${({$style}) => $style === "red" && "color: rgb(190, 44, 44); font-weight: bold; border-color: rgb(190, 44, 44);"}
   }
`;