"use client";

import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import styled, { keyframes, css } from "styled-components";
import { RotateCcw, Send } from "lucide-react";
import cloneDeep from "lodash/cloneDeep";
import { ClozeContextValue, ClozeFormData } from "@/types";

export default function GenericClozeQuestion({ QnContextToUse }: { QnContextToUse: () => ClozeContextValue }) {

   const {
      wordsToTestArr,
      textArr,
      qnNum,
      title,
      isLoading,
      prevUserCorrectAns,
      handleCompletion
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

   if (prevUserCorrectAns !== null || isLoading) return null;

   async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
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
         await handleCompletion(correctAns);

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
      const resettedFormData = cloneDeep(formData);
      for (let i in resettedFormData) {
         if (resettedFormData[i].isCorrect !== true) {
            resettedFormData[i].value = "";
         }
      }
      setFormData(resettedFormData);
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

            const {value, isCorrect} = formData[blankCountr];

            currArray.push(
               <span key={blankCountr} className="d-inline-block">
                  <strong>({blankCountr + 1})</strong>&nbsp;
                  <ClozeInputElement
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

   return (
      <section>

         <Alert variant="info">
            {
               hasAttempted
               ? "Refresh the page to see the correct answers."
               : "Get at least 8 / 15 blanks correct."
            }
         </Alert>

         <form
            onSubmit={handleFormSubmit} 
            style={{lineHeight: "40px", fontSize: "17px", textAlign: "justify"}}
         >

            <article>
               <header><strong><u>Cloze #{qnNum}: {title}</u></strong></header>
               {paragraphToRender.map((paraArr, idx) => 
                  <p key={idx}>{paraArr}</p>)
               }
            </article>

            <section className="mt-3 hstack gap-3 d-flex justify-content-center">

               <div>
                  Score: <strong>{score} / 15</strong>
               </div>

               <Button 
                  type="submit"
                  variant="danger"
                  disabled={hasAttempted || isLoading}
                  className="d-flex align-items-center fw-bold"
               >
                  <Send size={22} strokeWidth={2} className="me-1"/>
                  {`Submit (${numTriesLeft} ${numTriesLeft === 1 ? "try" : "tries"} left)`}
               </Button>

               <Button 
                  onClick={() => handleReset()}
                  variant="secondary"
                  disabled={hasAttempted || isLoading}
                  className="d-flex align-items-center fw-bold"
               >
                  <RotateCcw size={22} strokeWidth={2} className="me-1"/>Reset
               </Button>

            </section>

         </form>

      </section>
   )
}

const inputAnim = keyframes`
   0% { transform: scale(1); }
   50% { transform: scale(1.1); }
   100% { transform: scale(1); }
`;

const ClozeInputElement = styled.input<{
   $animate: boolean,
   $isCorrect: boolean | null
}>`
   width: 130px;
   height: 32px;
   text-align: center;
   border: 2px solid;

   border-color: ${({$isCorrect}) => $isCorrect === true ? "green" : ($isCorrect === false ? "rgb(190, 44, 44)" : "lightGray")};
   color: ${({$isCorrect}) => $isCorrect ? "green" : "default"};
   font-weight: ${({$isCorrect}) => $isCorrect ? "bold" : "default"};

   ${(props) =>
      props.$animate && css`animation: ${inputAnim} 400ms infinite;`
   }
`