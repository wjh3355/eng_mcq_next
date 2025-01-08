"use client";

import React, { createContext, useState, useEffect, useContext, useCallback } from "react";

import { QnCategory, MCQContextValue, MCQQnObj, EMPTY_MCQ_CONTEXT_VALUE, EMPTY_MCQ_QN_OBJ } from "@/types";

import { fetchQn } from "@/utils/qnActions";
import { updateUserQnData } from "@/utils/updateUserData";
import fetchUserData from "@/utils/fetchUserData";

export default function createGenericMCQProvider({
   qnCategory,
   qnNumArray,
   userName,
   isSetRandom,
   isRedo
}: {
   qnCategory: QnCategory | "demo"
   qnNumArray: number[],
   userName: string,
   isSetRandom: boolean,
   isRedo: boolean
}) {

   const toUseUserData: boolean = !(qnCategory === "demo" || userName === "" || isRedo);

   const QnContext = createContext<MCQContextValue>(EMPTY_MCQ_CONTEXT_VALUE);

   function useMCQContext() { 
      return useContext(QnContext);
   }

   function MCQProvider({ children }: { children: React.ReactNode }) {

      const [qnSequence, setQnSequence] = useState<number[]>(qnNumArray);
      const [qnObj, setQnObj] = useState<MCQQnObj>(EMPTY_MCQ_QN_OBJ);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
      const [thisSessionScore, setThisSessionScore] = useState<[number, number]>([0, 0]);
      const [userPoints, setUserPoints] = useState<number>(NaN);
      const [wrongAnsArr, setWrongAnsArr] = useState<MCQQnObj[]>([]);
      const [error, setError] = useState<string>("");
      const [hasReachedEnd, setHasReachedEnd] = useState<boolean>(false);

      async function handleOptionClick(isCorr: boolean) {
         setIsCorrect(isCorr);

         if (isCorr) {
            setThisSessionScore(([right, tot]) => [right+1, tot+1]);
         } else {
            setThisSessionScore(([right, tot]) => [right, tot+1]);

            if (!wrongAnsArr.some(existingQnObj => existingQnObj.qnNum === qnObj.qnNum)) {
               setWrongAnsArr(prevArr => [qnObj, ...prevArr]);
            }
         }

         if (toUseUserData) {
            try {
               await updateUserQnData({
                  userName,
                  cat: qnCategory, 
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
         setThisSessionScore([0, 0]);
         setIsCorrect(null);
         setIsLoading(true);
         setHasReachedEnd(false);
         setQnSequence(qnNumArray);
      }
      
      function handleNextQnBtnClick() {
         setIsLoading(true);
         setIsCorrect(null);
         setQnSequence(prev => prev.slice(1));
      }

      const fetchNewQnObj = useCallback(async () => {
         setQnObj(EMPTY_MCQ_QN_OBJ);

         if (qnSequence.length === 0) {
            setHasReachedEnd(true);
         } else {
            try {

               setQnObj(await fetchQn(qnCategory, qnSequence[0]));
               if (toUseUserData) setUserPoints((await fetchUserData(userName)).score);

            } catch (error) {

               if (error instanceof Error) {
                  console.error("Error when fetching new question or user data:", error.message);
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
            qnCategory,
            qnObj,
            isLoading,
            isCorrect,
            thisSessionScore,
            userPoints,
            wrongAnsArr,
            hasReachedEnd,
            isSetRandom,
            error,
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
