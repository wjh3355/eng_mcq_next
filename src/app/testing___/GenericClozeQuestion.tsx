"use client";

import { ClozeContextValue, ClozeFormData } from "@/types";
import { RotateCcw, CircleArrowRight, TriangleAlert } from "lucide-react";
import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import styled, { keyframes, css } from "styled-components";
import Skeleton from "react-loading-skeleton";

export default function GenericClozeQuestion({ QnContextToUse }: { QnContextToUse: () => ClozeContextValue }) {

   const { clozeObj: { passage }, handleNextQnBtnClick, isLoading, hasReachedEnd } = QnContextToUse();

   const [formData, setFormData] = useState<ClozeFormData>({});
   const [textArr, setTextArr] = useState<string[]>([]);
   const [hasSubmittedBefore, setHasSubmittedBefore] = useState<boolean>(false);
   const [score, setScore] = useState<number>(0);
   const [maxScore, setMaxScore] = useState<number>(0);
   const [is12orMoreCorrect, setIs12orMoreCorrect] = useState<boolean>(false);
   const [animateWrong, setAnimateWrong] = useState<boolean>(false);

   useEffect(() => {
      if (isLoading) return;

      const wordsToTestArr: string[][] = passage
         .match(/\{[^}]*\}/g)!
         .map((match) => 
            [...match.slice(1, -1).split("/").filter((word) => word !== "")]);
         
      const textArr = passage.split(/\{[^}]*\}/g);
   
      const initialFormData: ClozeFormData = Object.fromEntries(
         Array.from(
            { length: wordsToTestArr.length }, 
            (_, i) => [
               i, 
               { 
                  value: "", 
                  isCorrect: null, 
                  correctAnswers: wordsToTestArr[i] 
               }
            ]
         )
      );

      setFormData(initialFormData);
      setTextArr(textArr);
      setMaxScore(wordsToTestArr.length);

      return () => {
         setFormData({});
         setTextArr([]);
         setIs12orMoreCorrect(false);
         setScore(0);
         setMaxScore(0);
         setHasSubmittedBefore(false);
      }
   }, [passage, isLoading])

   function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const newData = { ...formData };

      for (let i in newData) {
         const { value, correctAnswers } = newData[i];
         const trimmedValue = value.trim();
         newData[i].isCorrect = correctAnswers.includes(trimmedValue);
         newData[i].value = trimmedValue;
      }
      
      const newScore = Object
         .values(newData)
         .map(dat => dat.isCorrect)
         .filter(stat => stat === true)
         .length;
      
      setScore(newScore);
      if (newScore >= 12) setIs12orMoreCorrect(true);
      
      if (!hasSubmittedBefore) setHasSubmittedBefore(true);

      setFormData(newData);
      
      setAnimateWrong(true);
      setTimeout(() => setAnimateWrong(false), 400);
   };

   function handleInputUpdate(event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target;
      const i = Number(name);
      setFormData(prv => ({
         ...prv,
         [i]: { ...prv[i], value }
      }))
   };

   function handleReset() {
      const resettedData = { ...formData };

      for (let i in resettedData) {
         const { isCorrect } = resettedData[i];
         if (isCorrect !== true) {
            resettedData[i].value = ""
         }
      }

      setFormData(resettedData);
   }

   function handleKeypress(event: React.KeyboardEvent) {
      if (event.key === 'Enter') event.preventDefault();
   };

   const paragraphToRender: (string | React.JSX.Element)[][] = (() => {
      const paragraphsWithInput = textArr.reduce<(string | React.JSX.Element)[]>(
         (acc, part, idx) => {
   
            const splitPart = part.split(/(\|\|)/);
   
            if (idx === textArr.length - 1) {
               return [...acc, ...splitPart];
            } 
   
            let { value, isCorrect } = formData[idx];

            return [
               ...acc,
               ...splitPart,
               <span key={idx} className="d-inline-block">
                  <strong>({idx + 1})</strong>&nbsp;
                  <ClozeInput
                     autoFocus={idx === 0}
                     disabled={isCorrect === true || is12orMoreCorrect}
                     autoComplete="off"
                     
                     type="text"
                     name={idx.toString()}
                     value={value}

                     onChange={handleInputUpdate}
                     onKeyDown={handleKeypress}

                     $isCorrect={isCorrect}
                     $animate={animateWrong && (isCorrect === false)}
                  />
               </span>
            ]; 
         }, []
      );
   
      let formattedParagraphs: (string | React.JSX.Element)[][] = [];
      let currentArray: (string | React.JSX.Element)[] = [];
      for (let item of paragraphsWithInput) {
         if (item === "||") {
            formattedParagraphs.push(currentArray);
            currentArray = [];
         } else {
            currentArray.push(item);
         }
      }
      if (currentArray.length > 0) formattedParagraphs.push(currentArray);

      return formattedParagraphs;
   })();
   
   if (hasReachedEnd) return null;

   return (
      <>
         {
            hasSubmittedBefore && !is12orMoreCorrect &&
            <Alert variant="info" className="d-flex align-items-center">
               <TriangleAlert />&nbsp;<strong>You need to get at least 12 words correct!</strong>
            </Alert>
         }

         <form 
            onSubmit={handleFormSubmit} 
            style={{lineHeight: "40px", fontSize: "17px", textAlign: "justify"}}
         >
            {
               !isLoading
               ?  <div>
                     {paragraphToRender.map((paraArr, idx) => 
                        <p key={idx}>{paraArr}</p>)
                     }
                  </div>
               :  <Skeleton height={30}/>
            }

            <div className="mt-3 hstack gap-3 d-flex justify-content-center">

               <div className="border border-2 rounded border-info px-2">
                  Score: {score} / {maxScore}
               </div>

               <Button 
                  type="submit"
                  disabled={is12orMoreCorrect || isLoading}
                  variant="danger"
               >
                  Submit Answer
               </Button>

               <Button 
                  onClick={() => handleReset()}
                  variant="secondary"
                  disabled={is12orMoreCorrect || isLoading}
                  className="d-flex align-items-center"
               >
                  <RotateCcw size={22} strokeWidth={2}/>&nbsp;Reset
               </Button>

               <Button 
                  onClick={() => handleNextQnBtnClick()}
                  variant="primary"
                  disabled={!is12orMoreCorrect || isLoading}
                  className="d-flex align-items-center"
               >
                  Next&nbsp;<CircleArrowRight size={22} strokeWidth={2}/>
               </Button>

            </div>
         </form>

         {
            is12orMoreCorrect &&
               <Card border="success" className="mt-3">
                  <Card.Header>
                     Solution:
                  </Card.Header>
                  <Card.Body>
                     <AnswersListWrapper>
                        {
                           Object.values(formData).map(({ correctAnswers }, idx) => 
                              <div key={idx}>
                                 {Number(idx)+1})&nbsp;{correctAnswers.join(" / ")}
                              </div>
                           )
                        }
                     </AnswersListWrapper>
                  </Card.Body>
               </Card>
         }
      </>
   );
}

const AnswersListWrapper = styled.div`
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
   gap: 5px
`

const inputAnimation = keyframes`
   0% { transform: scale(1); }
   50% { transform: scale(1.1); }
   100% { transform: scale(1); }
`;

const ClozeInput = styled.input<{
   $animate: boolean,
   $isCorrect: boolean | null
}>`
   width: 130px;
   height: 32px;
   text-align: center;
   border: 2px solid;

   border-color: ${({$isCorrect}) => $isCorrect === true ? "green" : ($isCorrect === false ? "rgb(190, 44, 44)" : "default")};
   color: ${({$isCorrect}) => $isCorrect ? "green" : "default"};
   font-weight: ${({$isCorrect}) => $isCorrect ? "bold" : "default"};

   ${(props) =>
      props.$animate && css`animation: ${inputAnimation} 400ms infinite;`
   }
`