"use client";

import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import ClozeInput from "./ClozeInput";
import cloneDeep from "lodash/cloneDeep";
import { ClozeContextValue, ClozeFormData } from '@/definitions';
import Card from "react-bootstrap/Card";

export default function GenericCloze({ QnContextToUse }: { QnContextToUse: () => ClozeContextValue }) {

   const {
      wordsToTestArr,
      textArr,
      passageTitle,
      isLoading,
      prevUserCorrectAns,
      handleCompletion,
      isDemo
   } = QnContextToUse();

   const [formData, setFormData] = useState<ClozeFormData>({});
   const [score, setScore] = useState<number>(0);
   const [numTriesLeft, setNumTriesLeft] = useState<number>(3);
   const [hasAttempted, setHasAttempted] = useState<boolean>(false);
   const [animateWrong, setAnimateWrong] = useState<boolean>(false);

   useEffect(() => {
      if (isLoading) return;

      setFormData(
         Object.fromEntries(
            Array.from(
               { length: wordsToTestArr.length },
               (_, i) => (               
                  [
                     i, 
                     {
                        value: "", 
                        isCorrect: null, 
                        correctAnswers: wordsToTestArr[i] 
                     }
                  ]
               )
            )
         )
      )
   }, [wordsToTestArr, isLoading])

   if (isLoading || (prevUserCorrectAns !== null && !isDemo)) return null;

   function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const newFormData = cloneDeep(formData);

      for (let i in newFormData) {
         const { value, correctAnswers } = newFormData[i];
         const trimmedValue = value.trim();
         newFormData[i].isCorrect = correctAnswers.includes(trimmedValue);
         newFormData[i].value = trimmedValue;
      }
      
      const correctAns = Object
         .entries(newFormData)
         .filter(([_, dat]) => dat.isCorrect === true)
         .map(([idx, _]) => Number(idx))
      
      setScore(correctAns.length);

      setFormData(newFormData);

      setAnimateWrong(true);
      setTimeout(() => setAnimateWrong(false), 400);

      if (numTriesLeft === 1 || correctAns.length >= 8) {

         setNumTriesLeft(prev => prev - 1);
         setHasAttempted(true);
         handleCompletion(correctAns);

      } else {

         setNumTriesLeft(prev => prev - 1);
         
      }
   }

   function handleInputUpdate(event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target;
      const i = Number(name);
      setFormData(prv => ({
         ...prv,
         [i]: { ...prv[i], value }
      }))
   }

   function handleReset() {
      setFormData(prev => {
         const newFormData = cloneDeep(prev);
         for (let i in newFormData) {
            if (newFormData[i].isCorrect !== true) {
               newFormData[i].value = "";
            }
         }
         return newFormData;
      });
   }

   function handleKeypress(event: React.KeyboardEvent) {
      if (event.key === 'Enter') event.preventDefault();
   }

   const paragraphToRender: (string | React.JSX.Element)[][] = (() => {
      if (JSON.stringify(formData) === "{}") return [];

      let blankCountr = 0;

      let formattedParagraphs: (string | React.JSX.Element)[][] = [];
      let currArray: (string | React.JSX.Element)[] = [];

      for (let fragment of textArr) {

         if (fragment === "||") {

            formattedParagraphs.push(currArray);
            currArray = [];

         } else if (fragment === "BLANK") {

            const { value, isCorrect } = formData[blankCountr];

            currArray.push(
               <span key={blankCountr} className="d-inline-block">
                  <strong>({blankCountr + 1})</strong>&nbsp;
                  <ClozeInput
                     autoFocus={blankCountr === 0}
                     disabled={isCorrect === true || hasAttempted}
                     autoComplete="off"
                     
                     type="text"
                     name={blankCountr.toString()}
                     value={value}

                     onChange={handleInputUpdate}
                     onKeyDown={handleKeypress}

                     $isCorrect={isCorrect}
                     $animate={animateWrong && (isCorrect === false)}
                  />
               </span>
            );

            blankCountr++;

         } else {

            currArray.push(fragment);
            
         }
      }
      
      formattedParagraphs.push(currArray);

      return formattedParagraphs;
   })()

   function ClozeAlert() {
      if (isDemo) {
         return <Alert variant="info">
            Get at least 8 / 15 blanks correct.
         </Alert>
      } else {
         return <Alert variant="info">
            {hasAttempted
               ? "Refresh the page to see the correct answers."
               : "Get at least 8 / 15 blanks correct."
            }
         </Alert>;
      }
   }

   function AnswersForDemo() {
      if (isDemo && prevUserCorrectAns !== null) {
         return <Card className="mt-3 border-2 border-success">
            <Card.Header>Answers</Card.Header>
            <Card.Body>
               <div className="text-center">
                  <Button className="mb-2" onClick={() => window.location.reload()}><strong>Attempt cloze again</strong></Button>
               </div>
               <div className="grid">
                  {wordsToTestArr.map((thisBlankAns, ansNum) => 
                     <div key={ansNum} className="g-col-6">
                        {`${ansNum}) ${thisBlankAns.join("/")}`} 
                     </div>
                  )}
               </div>
            </Card.Body>
         </Card>
      } else return null
   }

   return (
      <section>
         
         <ClozeAlert/>

         <form onSubmit={handleFormSubmit} >

            <article style={{lineHeight: "40px", fontSize: "17px", textAlign: "justify"}}>
               <header className="fw-bold text-decoration-underline">{passageTitle}</header>
               {paragraphToRender.map((paraArr, idx) => 
                  <p key={idx}>{paraArr}</p>)
               }
            </article>

            <section className="vstack gap-2">

               <div className="mx-auto bg-warning px-4 border-0 rounded-2 py-2">
                  Score: <strong>{score} / 15</strong>
               </div>

               <div className="hstack gap-2 d-flex justify-content-center">
                  <Button 
                     type="submit"
                     variant="danger"
                     disabled={hasAttempted || isLoading}
                     className="fw-bold px-4"
                  >
                     Submit&nbsp;{`(${numTriesLeft} ${numTriesLeft === 1 ? "try" : "tries"} left)`}
                  </Button>

                  <Button 
                     onClick={() => handleReset()}
                     variant="secondary"
                     disabled={hasAttempted || isLoading}
                     className="fw-bold px-4"
                  >
                     Reset
                  </Button>
               </div>

            </section>

         </form>

         <AnswersForDemo/>

      </section>
   )
}