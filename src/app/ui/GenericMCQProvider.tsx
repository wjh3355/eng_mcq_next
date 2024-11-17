"use client";

import React, { createContext, useState, useEffect, useContext, useCallback } from "react";

import { CurrentQnCategories, MCQContextValue, QnObj, EMPTY_CONTEXT_VALUE, EMPTY_QN_OBJ } from "@/types";

import fetchQnFromDB from "@/lib/fetchQnFromDB";
import updateUserData from "@/lib/updateUserData";

export default function createGenericMCQProvider({
   qnCategory,
   qnNumArray,
   userName,
   trackQns,
}: {
   qnCategory: CurrentQnCategories
   qnNumArray: number[],
   userName: string,
   trackQns: boolean,
}) {

   const QnContext = createContext<MCQContextValue>(EMPTY_CONTEXT_VALUE);

   function useMCQContext() { 
      return useContext(QnContext);
   }

   function MCQProvider({ children }: { children: React.ReactNode }) {

      const [qnSequence, setQnSequence] = useState<number[]>(qnNumArray);
      const [qnObj, setQnObj] = useState<QnObj>(EMPTY_QN_OBJ);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [isNextQnBtnDisabled, setIsNextQnBtnDisabled] = useState<boolean>(true);
      const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
      const [score, setScore] = useState<[number, number]>([0, 0]);
      const [wrongAnsArr, setWrongAnsArr] = useState<QnObj[]>([]);
      const [error, setError] = useState<string>("");
      const [hasReachedEnd, setHasReachedEnd] = useState<boolean>(false);

      async function handleOptionClick(isCorr: boolean) {
         setIsNextQnBtnDisabled(false);
         setIsCorrect(isCorr);

         if (isCorr) {
            setScore(([right, tot]) => [right+1, tot+1]);
         } else {
            setScore(([right, tot]) => [right, tot+1]);

            if (!wrongAnsArr.some(existingQnObj => existingQnObj.qnNum === qnObj.qnNum)) {
               setWrongAnsArr(prevArr => [qnObj, ...prevArr]);
            }
         }

         if (trackQns && userName !== "") {
            try {
               await updateUserData({
                  cat: qnCategory, 
                  userName, 
                  qnNum: qnObj.qnNum, 
                  isCorrect: isCorr
               });
            } catch (error) {
               console.error("Error updating user data:", error);
               setError("Error updating user data");
            }
         }
      }

      function redoSet() {
         setWrongAnsArr([]);
         setScore([0, 0]);
         setIsNextQnBtnDisabled(true);
         setIsCorrect(null);
         setIsLoading(true);
         setHasReachedEnd(false);
         setQnSequence(qnNumArray);
      }
      
      function handleNextQnBtnClick() {
         setIsNextQnBtnDisabled(true);
         setIsLoading(true);
         setIsCorrect(null);
         setQnSequence(prev => prev.slice(1));
      }

      const fetchNewQnObj = useCallback(async () => {
         setQnObj(EMPTY_QN_OBJ);

         if (qnSequence.length === 0) {
            setHasReachedEnd(true);
         } else {
            try {
               setQnObj(await fetchQnFromDB(qnCategory, qnSequence[0]));
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
            isNextQnBtnDisabled,
            score,
            wrongAnsArr,
            error,
            hasReachedEnd,
            handleOptionClick,
            handleNextQnBtnClick,
            redoSet
         }}>
            {children}
         </QnContext.Provider>
      );
   }

   return { MCQProvider, useMCQContext };
}
