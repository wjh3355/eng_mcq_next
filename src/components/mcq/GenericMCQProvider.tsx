"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

import { QnCategory, MCQContextValue, MCQQnObj, EMPTY_MCQ_CONTEXT_VALUE, EMPTY_MCQ_QN_OBJ } from '@/definitions';

import axios, { AxiosError } from "axios";

export default function createGenericMCQProvider({
   qnCategory,
   qnNumArray,
   email,
   isSetRandom,
   isRedo
}: {
   qnCategory: QnCategory | "demo"
   qnNumArray: number[],
   email: string,
   isSetRandom: boolean,
   isRedo: boolean
}) {

   const toUseUserData: boolean = !(qnCategory === "demo" || email === "" || isRedo);

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

      function handleOptionClick(isCorr: boolean) {
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
            axios
               .post(
                  "/api/user/update-profile-data",
                  {
                     email,
                     action: {
                        todo: "update mcq",
                        mcqCategory: qnCategory,
                        mcqCatQnNum: qnObj.qnNum,
                        isCorrect: isCorr
                     }
                  }
               )
               .catch((err: AxiosError<{ error: string }>) => 
                  setError(err.response?.data.error ?? "An unknown error occurred")
               )
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

      useEffect(() => {

         setQnObj(EMPTY_MCQ_QN_OBJ);

         if (qnSequence.length === 0) {
            setHasReachedEnd(true);
            return;
         }

         if (qnCategory === "demo") {
            axios
               .get(
                  "/api/qns/get-demo-mcq-qn",
                  { params: { qnNum: qnSequence[0] } }
               )
               .then(res => setQnObj(res.data.qnObj))
               .catch((err: AxiosError<{ error: string }>) => 
                  setError(err.response?.data.error ?? "An unknown error occurred")
               )
         } else {
            axios
               .get(
                  "/api/qns/get-mcq-qn",
                  { params: { category: qnCategory, qnNum: qnSequence[0] } }
               )
               .then(res => setQnObj(res.data.qnObj))
               .catch((err: AxiosError<{ error: string }>) => 
                  setError(err.response?.data.error ?? "An unknown error occurred")
               )
         }

         if (toUseUserData) {
            axios
               .get(
                  "/api/user/get-user",
                  { params: { email, type: "profile" } }
               )
               .then(res => setUserPoints(res.data.userDoc.score))
               .catch((err: AxiosError<{ error: string }>) => 
                  setError(err.response?.data.error ?? "An unknown error occurred")
               )
         }   
   
      }, [qnSequence])

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
            numQnsInSet: qnNumArray.length,
            currNum: qnNumArray.length - qnSequence.length + 1,
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
