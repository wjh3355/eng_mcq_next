"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import shuffle from "lodash/shuffle";
import range from "lodash/range";
import isEqual from "lodash/isEqual";

import {
   GenericMCQContextValueType,
   QnObjType,
   emptyContextValue,
   emptyQnObj
} from "@/lib/data";

import fetchQnFromDB from "@/lib/fetchQnFromDB";

export default function createGenericMCQProvider( mongoCol: string, qnNumRange: [number, number] ) {

   const QnContext = createContext<GenericMCQContextValueType>(emptyContextValue);

   function useMCQContext() { 
      return useContext(QnContext);
   }

   function MCQProvider({ children }: { children: React.ReactNode }) {

      const [qnSequence, setQnSequence] = useState<number[]>([]);

      const [qnObj, setQnObj] = useState<QnObjType>(emptyQnObj);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [areBtnsDisabled, setAreBtnsDisabled] = useState<boolean>(true);
      const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
      const [score, setScore] = useState<[number, number]>([0, 0]);
      const [wrongAnsArr, setWrongAnsArr] = useState<QnObjType[]>([]);
      const [error, setError] = useState<string>("");

      function showWrongQnsAgain() {
         const wrongQnNums = wrongAnsArr.map(obj => obj.qnNum);
         setWrongAnsArr([]);
         setScore([0, 0]);
         setAreBtnsDisabled(true);
         setIsCorrect(null);
         setIsLoading(true);
         setQnSequence(prev => [...wrongQnNums, ...prev]);
      }

      function handleOptionClick(isCorr: boolean) {
         setAreBtnsDisabled(false);
         setIsCorrect(isCorr);
      }
      
      function handleNextQnBtnClick() {
         setScore(([right, tot]) => isCorrect ? [right+1, tot+1] : [right, tot+1]);
         if (!isCorrect && !wrongAnsArr.some(existingQnObj => isEqual(existingQnObj, qnObj))) {
            setWrongAnsArr(prevArr => [qnObj, ...prevArr]);
         }

         setAreBtnsDisabled(true);
         setIsCorrect(null);
         setIsLoading(true);
         setQnSequence(prev => prev.length > 1 ?  prev.slice(1) : shuffle(range(...qnNumRange)));
      }

      useEffect(() => {
         setQnSequence(shuffle(range(...qnNumRange)));
      }, [])

      useEffect(() => {
         async function fetchNewQnObj() {
            if (qnSequence.length === 0) return;

            setQnObj(emptyQnObj);
      
            try {
   
               setQnObj(await fetchQnFromDB(mongoCol, qnSequence[0]));
   
            } catch (error) {
               if (error instanceof Error) {
                  console.error("Error when fetching new QnObj:", error.message);
                  setError(error.message);
                  
               } else {
                  console.error("An unexpected error occurred:", error);
                  setError("An unexpected error occurred");
   
               }
            }
         }

         fetchNewQnObj();
      }, [qnSequence])

      useEffect(() => {
         if (!isEqual(qnObj, emptyQnObj)) setIsLoading(false);
      }, [qnObj])

      const contextValue: GenericMCQContextValueType = {
         qnObj,
         isLoading,
         isCorrect,
         areBtnsDisabled,
         score,
         wrongAnsArr,
         error,

         handleOptionClick,
         handleNextQnBtnClick,
         showWrongQnsAgain,
      }

      return (
         <QnContext.Provider value={contextValue}>
            {children}
         </QnContext.Provider>
      );
      
   }

   return { MCQProvider, useMCQContext };
}
