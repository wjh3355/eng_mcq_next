"use client";

import { ClozeContextValue, ClozeFormData } from "@/types";
import { RotateCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import styled, { keyframes, css } from "styled-components";
import Skeleton from "react-loading-skeleton";

export default function GenericClozeQuestion({ QnContextToUse }: { QnContextToUse: () => ClozeContextValue }) {

   const { clozeObj: { passage, qnNum }, isLoading } = QnContextToUse();

   const [formData, setFormData] = useState<ClozeFormData>({});
   const [textArr, setTextArr] = useState<string[]>([]);
   const [score, setScore] = useState<number>(0);
   const [numWordsTested, setNumWordsTested] = useState<number>(0);
   const [numTriesLeft, setNumTriesLeft] = useState<number>(3);
   const [showAns, setShowAns] = useState<boolean>(false);
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
      setNumWordsTested(wordsToTestArr.length);

      return () => {
         setFormData({});
         setTextArr([]);
         setScore(0);
         setNumWordsTested(0);
         setNumTriesLeft(3);
         setShowAns(false);
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

      setFormData(newData);

      if (numTriesLeft === 1 || newScore >= 8) {
         setShowAns(true);
      } else {
         setNumTriesLeft(prev => prev - 1);
         setAnimateWrong(true);
         setTimeout(() => setAnimateWrong(false), 400);
      }
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
                     disabled={isCorrect === true || showAns}
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

   return (
      <>
         <form 
            onSubmit={handleFormSubmit} 
            style={{lineHeight: "40px", fontSize: "17px", textAlign: "justify"}}
         >
            {
               !isLoading
               ?  <div>
                     <div>
                        <strong><u>Cloze #{qnNum}</u></strong>
                     </div>
                     {paragraphToRender.map((paraArr, idx) => 
                        <p key={idx}>{paraArr}</p>)
                     }
                  </div>
               :  <Skeleton height={30}/>
            }

            <div className="mt-3 hstack gap-3 d-flex justify-content-center">

               <div className="border border-2 rounded border-info px-2">
                  Score: {score} / {numWordsTested}
               </div>

               <Button 
                  type="submit"
                  disabled={showAns || isLoading}
                  variant="danger"
               >
                  Submit Answer
               </Button>

               <Button 
                  onClick={() => handleReset()}
                  variant="secondary"
                  disabled={showAns || isLoading}
                  className="d-flex align-items-center"
               >
                  <RotateCcw size={22} strokeWidth={2}/>&nbsp;Reset
               </Button>
            </div>
         </form>

         {
            showAns 
               ?  <Card border="success" className="mt-3">
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
               :  <div className="text-center fw-bold my-3">
                     You need to get at least 8 blanks correct ({numTriesLeft} tries left)
                  </div>
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

   border-color: ${({$isCorrect}) => $isCorrect === true ? "green" : ($isCorrect === false ? "rgb(190, 44, 44)" : "lightGray")};
   color: ${({$isCorrect}) => $isCorrect ? "green" : "default"};
   font-weight: ${({$isCorrect}) => $isCorrect ? "bold" : "default"};

   ${(props) =>
      props.$animate && css`animation: ${inputAnimation} 400ms infinite;`
   }
`