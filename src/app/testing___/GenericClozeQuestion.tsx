"use client";

import { ClozeContextValue, ClozeFormData } from "@/types";
import { RotateCcw, CircleArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Skeleton from "react-loading-skeleton";

export default function GenericClozeQuestion({ QnContextToUse }: { QnContextToUse: () => ClozeContextValue }) {

   const { clozeObj: { passage }, handleNextQnBtnClick, isLoading, hasReachedEnd } = QnContextToUse();

   const [formData, setFormData] = useState<ClozeFormData>({});
   const [initFormData, setInitFormData] = useState<ClozeFormData>({});
   const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
   const [textArr, setTextArr] = useState<string[]>([]);
   const [maxScore, setMaxScore] = useState<number>(0);

   useEffect(() => {
      if (isLoading) return;

      const wordsToTestArr: string[][] = passage
         .match(/\{[^}]*\}/g)!
         .map((match) => 
            [...match.slice(1, -1).split("/").filter((word) => word !== "")]);
      
      const numOfWordsToTest = wordsToTestArr.length;
   
      const textArr = passage.split(/\{[^}]*\}/g);
   
      const initialFormData: ClozeFormData = Object.fromEntries(
         Array.from(
            { length: numOfWordsToTest }, 
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
      setInitFormData(initialFormData);
      setTextArr(textArr);
      setMaxScore(numOfWordsToTest);

      return () => {
         setFormData({});
         setInitFormData({});
         setTextArr([]);
         setIsFormSubmitted(false);
         setMaxScore(0);
      }
   }, [passage, isLoading])

   function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const newData = { ...formData };

      Object.entries(formData).forEach(([idx, { value, correctAnswers }]) => {
         const trimmedValue = value.trim();
         const i = Number(idx);
         newData[i].isCorrect = correctAnswers.includes(trimmedValue);
         newData[i].value = trimmedValue;
      });
      
      setFormData(newData);
      setIsFormSubmitted(true);
   };

   function handleInputUpdate(event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target;
      const i = Number(name);
      setFormData(prv => ({
         ...prv,
         [i]: { ...prv[i], value }
      }))
   };

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
   
            let inputTextClass = "text-center border border-2 ";
            let { value, isCorrect } = formData[idx];
            if (isCorrect === true) {
               inputTextClass += "border-success text-success fw-bold";
            } else if (isCorrect === false) {
               inputTextClass += "border-danger text-danger fw-bold";
            }
   
            return [
               ...acc,
               ...splitPart,
               <span key={idx} className="d-inline-block">
                  <strong>({idx + 1})</strong>&nbsp;
                  <input
                     autoFocus={idx === 0}
                     style={{ width: "130px", height: "32px" }}
                     className={inputTextClass}
                     disabled={isCorrect !== null}
                     type="text"
                     name={idx.toString()}
                     value={value}
                     onChange={handleInputUpdate}
                     onKeyDown={handleKeypress}
                  />
               </span>,
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

   const score = Object
      .values(formData)
      .map(dat => dat.isCorrect)
      .filter(stat => stat === true)
      .length;
   
   if (hasReachedEnd) return null;

   return (
      <>
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
               <Button 
                  type="submit"
                  disabled={isFormSubmitted || isLoading}
                  variant="danger"
               >
                  Submit Answer
               </Button>
               <Button 
                  onClick={() => setFormData(initFormData)}
                  variant="secondary"
                  disabled={isFormSubmitted || isLoading}
                  className="d-flex align-items-center"
               >
                  <RotateCcw size={22} strokeWidth={2}/>&nbsp;Reset
               </Button>
               <Button 
                  onClick={() => handleNextQnBtnClick()}
                  variant="primary"
                  disabled={!isFormSubmitted || isLoading}
                  className="d-flex align-items-center"
               >
                  Next&nbsp;<CircleArrowRight size={22} strokeWidth={2}/>
               </Button>
            </div>
         </form>

         {
            isFormSubmitted &&
            <>
               <div className="d-flex justify-content-center my-3">
                  <span className="border border-0 px-3 py-2 rounded-4 bg-warning">
                     <strong>
                        {`Score: ${score} / ${maxScore}`}
                     </strong>
                  </span>
               </div>
               <Card>
                  <Card.Header>
                     Answers
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
            </>
         }
      </>
   );
}

const AnswersListWrapper = styled.div`
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
   gap: 5px
`