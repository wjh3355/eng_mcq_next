"use client";

import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import shuffle from "lodash/shuffle";
import range from "lodash/range";

import {
   GenericMCQContextValueType,
   QnObjType,
   emptyContextValue,
   emptyQnObj
} from "@/lib/data";

import fetchQnFromDB from "@/lib/fetchQnFromDB";
import updateUserData from "@/lib/updateUserData";

export default function createGenericMCQProvider({
   qnCategoryName, 
   qnMongoCollection, 
   qnNumRange, 
   userName,
   trackQns
}: {
   qnCategoryName: string, 
   qnMongoCollection: string, 
   qnNumRange: [number, number], 
   userName: string,
   trackQns: boolean
}) {

   const QnContext = createContext<GenericMCQContextValueType>(emptyContextValue);

   function useMCQContext() { 
      return useContext(QnContext);
   }

   function MCQProvider({ children }: { children: React.ReactNode }) {

      const [qnSequence, setQnSequence] = useState<number[]>(shuffle(range(...qnNumRange)));
      const [qnObj, setQnObj] = useState<QnObjType>(emptyQnObj);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [areBtnsDisabled, setAreBtnsDisabled] = useState<boolean>(true);
      const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
      const [score, setScore] = useState<[number, number]>([0, 0]);
      const [wrongAnsArr, setWrongAnsArr] = useState<QnObjType[]>([]);
      const [error, setError] = useState<string>("");

      function showWrongQnsAgain() {
         const wrongQnNums = wrongAnsArr.map(obj => obj.qnNum).toReversed();
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
      
      async function handleNextQnBtnClick() {
         setAreBtnsDisabled(true);
         setIsLoading(true);
         setIsCorrect(null);

         if (isCorrect) {
            setScore(([right, tot]) => [right+1, tot+1]);
         } else {
            setScore(([right, tot]) => [right, tot+1]);

            if (!wrongAnsArr.some(existingQnObj => existingQnObj.qnNum === qnObj.qnNum)) {
               setWrongAnsArr(prevArr => [qnObj, ...prevArr]);
            }
         }

         if (trackQns) {
            await updateUserData(qnCategoryName, userName, qnObj.qnNum, isCorrect);
         }

         setQnSequence(prev => prev.length > 1 ?  prev.slice(1) : shuffle(range(...qnNumRange)));
      }

      const fetchNewQnObj = useCallback(async () => {
         setQnObj(emptyQnObj);
         try {
            setQnObj(await fetchQnFromDB(qnMongoCollection, qnSequence[0]));
         } catch (error) {
            if (error instanceof Error) {
               console.error("Error when fetching new QnObj:", error.message);
               setError(error.message);
            } else {
               console.error("An unexpected error occurred:", error);
               setError("An unexpected error occurred");
            }
         }
      }, [qnSequence]);

      useEffect(() => {
         fetchNewQnObj();
      }, [fetchNewQnObj])

      useEffect(() => {
         if (!Number.isNaN(qnObj.qnNum)) setIsLoading(false);
      }, [qnObj])

      return (
         <QnContext.Provider value={{
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
         }}>
            {children}
         </QnContext.Provider>
      );
   }

   return { MCQProvider, useMCQContext };
}
