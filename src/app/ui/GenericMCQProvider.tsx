"use client";

import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import shuffle from "lodash/shuffle";
import range from "lodash/range";

import { CurrentQnCategories, MCQContextValue, QnObj, EMPTY_CONTEXT_VALUE, EMPTY_QN_OBJ } from "@/types";

import fetchQnFromDB from "@/lib/fetchQnFromDB";
import updateUserStats from "@/lib/updateUserStats";

export default function createGenericMCQProvider({
   qnCategory,
   qnMongoCollection, 
   qnNumRange, 
   userName,
   trackQns
}: {
   qnCategory: CurrentQnCategories
   qnMongoCollection: string, 
   qnNumRange: [number, number], 
   userName: string | null,
   trackQns: boolean
}) {

   const QnContext = createContext<MCQContextValue>(EMPTY_CONTEXT_VALUE);

   function useMCQContext() { 
      return useContext(QnContext);
   }

   function MCQProvider({ children }: { children: React.ReactNode }) {

      const [qnSequence, setQnSequence] = useState<number[]>(shuffle(range(...qnNumRange)));
      const [qnObj, setQnObj] = useState<QnObj>(EMPTY_QN_OBJ);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [areBtnsDisabled, setAreBtnsDisabled] = useState<boolean>(true);
      const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
      const [score, setScore] = useState<[number, number]>([0, 0]);
      const [wrongAnsArr, setWrongAnsArr] = useState<QnObj[]>([]);
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

         if (trackQns && userName) {
            await updateUserStats({
               qnCategory, 
               userName, 
               qnNum: qnObj.qnNum, 
               isCorrect
            });
         }

         setQnSequence(prev => prev.length > 1 ?  prev.slice(1) : shuffle(range(...qnNumRange)));
      }

      const fetchNewQnObj = useCallback(async () => {
         setQnObj(EMPTY_QN_OBJ);
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
