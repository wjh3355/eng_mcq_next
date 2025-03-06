"use client";

import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ClozeInput from "./ClozeInput";
import cloneDeep from "lodash/cloneDeep";
import type { ClozeFormData } from '@/definitions';
import Card from "react-bootstrap/Card";
import toast from "react-hot-toast";
import { useClozeContext } from "./useClozeProvider";

export default function ClozeAttemptUI() {

   const {
      wordsToTestArr,
      textArr,
      passageTitle,
      isLoading,
      prevUserCorrectAns,
      handleCompletion,
      isDemo
   } = useClozeContext();

   const [formData, setFormData] = useState<ClozeFormData>({});
   const [score, setScore] = useState<number>(0);
   const [numTriesLeft, setNumTriesLeft] = useState<number>(3);
   const [isSubmitBtnCooldown, setIsSubmitBtnCooldown] = useState(false);
   const [hasAttempted, setHasAttempted] = useState(false);

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

      if (numTriesLeft === 1 || correctAns.length >= 8) {

         setNumTriesLeft(prev => prev - 1);
         setHasAttempted(true);
         handleCompletion(correctAns);

      } else {

         setNumTriesLeft(prev => prev - 1);
         toast.error(`Sorry, you did not pass.\n\nGet at least 8 blanks correct. You have ${numTriesLeft-1} attempt(s) left.`);
         setIsSubmitBtnCooldown(true);
         setTimeout(() => setIsSubmitBtnCooldown(false), 3000);
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
   })();

   function AnswersForDemo() {
      if (isDemo && prevUserCorrectAns !== null) {
         return <Card className="mt-3 border-2 border-success shadow">
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
                     disabled={hasAttempted || isLoading || isSubmitBtnCooldown}
                     className="fw-bold px-4"
                  >
                     {`Submit: ${numTriesLeft} attempt(s) left`}
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