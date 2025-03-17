"use client";

import { ChangeEvent } from "react";
import Col from "react-bootstrap/esm/Col";
import Card from "react-bootstrap/esm/Card";
import styled from "styled-components";

import { MTState } from "@/definitions";
import { useMockTestContext } from "./MTProvider";

function SentenceDisp({ thisQnState }: { thisQnState: MTState }) {

   if (thisQnState.type !== "question") return null;

   const { kindOfQn, sentence, wordToTest, def } = thisQnState.qnObj;

   switch (kindOfQn) {
      case "meaning":
      case "spelling":

         const [bef, aft] = sentence.split(new RegExp(`\\b${wordToTest!}\\b`));
         return <><strong>{`Q${thisQnState.qnIndex+1}. `}</strong>{bef}<strong>{wordToTest}</strong>{aft}</>;

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
               className={`d-block ${isGreen ? "text-success fw-bold" : isRed ? "text-danger fw-bold" : ""}`}
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
               &nbsp;{thisOption}
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

function SubmittedText({
   isSubmitted,
   thisQnState
}: {
   isSubmitted: boolean;
   thisQnState: MTState;
}) {

   if (!isSubmitted) return null;

   let text: React.ReactNode;

   if (thisQnState.status === "correct") {
      text = <small className="text-success fw-bold">Correct!</small>;
   } else if (thisQnState.status === "incorrect") {
      if (thisQnState.answer) {
         text = <small className="text-danger fw-bold">Incorrect!</small>;
      } else {
         text = <small className="text-danger fw-bold">You did not attempt.</small>;
      }
   }

   return <div className="mt-2 mx-auto">{text}</div>
}

export default function MTQuestion() {
   const { 
      testStates,
      currUserPage,
      handleTouched,
      handleReset,
      isMTSubmitted
   } = useMockTestContext();

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
            <Card body className="shadow border-0">
               <div className="d-flex flex-column justify-content-left">
                  <MTQuestionAnswer
                     thisQnState={displayedQnState}
                     isMTSubmitted={isMTSubmitted}
                     handleTouched={handleTouched}
                     handleReset={handleReset}
                  />
                  <SubmittedText isSubmitted={isMTSubmitted} thisQnState={displayedQnState}/>
               </div>
            </Card>
         </Col>
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