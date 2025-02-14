"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

import { McqCategory, MCQContextValue, MCQQnObj, EMPTY_MCQ_CONTEXT_VALUE, EMPTY_MCQ_QN_OBJ } from '@/definitions';

import { fetchDemoMcq, fetchMcq } from "@/lib/mongodb/mcq-server-actions";
import { fetchUser, updateUserProfile } from "@/lib/mongodb/user-server-actions";

export default function useGenericMcqProvider({
   McqCategory,
   qnNumArray,
   email,
   isSetRandom,
   isRedo
}: {
   McqCategory: McqCategory | "demo"
   qnNumArray: number[],
   email: string,
   isSetRandom: boolean,
   isRedo: boolean
}) {

   // toUseUserData is true if the category is not demo, email is not empty, and not redo
   const toUseUserData: boolean = !(McqCategory === "demo" || email === "" || isRedo);

   // create context, fallback is an empty context value
   const QnContext = createContext<MCQContextValue>(EMPTY_MCQ_CONTEXT_VALUE);

   // create hook to use context
   function useMCQContext() { return useContext(QnContext) }

   // create provider component
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
         // if isCorrect is null, it means the user has not clicked any option yet
         // so we set isCorrect to whether the user's answer is correct
         setIsCorrect(isCorr);

         if (isCorr) {
            // if correct, increment both right answers count and total questions count
            setThisSessionScore(([right, tot]) => [right+1, tot+1]);
         } else {
            // if wrong, increment total questions count only
            setThisSessionScore(([right, tot]) => [right, tot+1]);
            // if the question is not already in wrongAnsArr, add it
            if (!wrongAnsArr.some(existingQnObj => existingQnObj.qnNum === qnObj.qnNum)) {
               setWrongAnsArr(prevArr => [qnObj, ...prevArr]);
            }
         }

         if (toUseUserData && McqCategory !== "demo") {
            // if not demo, update user profile with correct answer
            updateUserProfile(email, {
               todo: "update mcq",
               mcqCategory: McqCategory,
               mcqCatQnNum: qnObj.qnNum,
               isMcqCorrect: isCorr
            }).then(res => res.error && setError(res.error));
         }
      }

      function redoSet() {
         // reset all states to initial values
         setWrongAnsArr([]);
         setThisSessionScore([0, 0]);
         setIsCorrect(null);
         setIsLoading(true);
         setHasReachedEnd(false);
         setQnSequence(qnNumArray);
      }
      
      function handleNextQnBtnClick() {
         // reset isCorrect to null, so that the user can click on the options again
         // set isLoading to true, so that the loading spinner is shown
         // remove the first element from qnSequence, so that the next question is fetched
         setIsLoading(true);
         setIsCorrect(null);
         setQnSequence(prev => prev.slice(1));
      }

      useEffect(() => {
         const fetchData = async() => {
            // set qnObj to an empty object
            setQnObj(EMPTY_MCQ_QN_OBJ);
      
            if (qnSequence.length === 0) {
               // if there are no more questions to fetch, set hasReachedEnd to true and return
               setHasReachedEnd(true);
               return;
            }
      
            try {
               // run server actions:
               // if demo, fetch demo mcq (category is 'demo' which is fixed)
               // else fetch actual mcq based on McqCategory and current question number (qnSequence[0])
               const mcqFetch = McqCategory === "demo" 
                  ? fetchDemoMcq(qnSequence[0]) 
                  : fetchMcq(McqCategory, qnSequence[0]);
      
               // if not demo, or email is not empty, or not redo, fetch user profile
               const userFetch = toUseUserData ? fetchUser(email, "profile") : Promise.resolve(null);
      
               // wait for both fetches to complete
               const [res1, usr] = await Promise.all([mcqFetch, userFetch]);
      
               // set qnObj to the fetched mcq object if no error
               "error" in res1 ? setError(res1.error) : setQnObj(res1);
               if (usr) {
                  "error" in usr ? setError(usr.error) : setUserPoints(usr.score);
               }
            } catch (err) {
               setError(err instanceof Error ? err.message : "An unknown error occurred");
            }
         };

         fetchData();
      }, [qnSequence])

      useEffect(() => {
         // if qnNum is not NaN, it means the qnObj has been set
         // so we set isLoading to false
         if (!Number.isNaN(qnObj.qnNum)) setIsLoading(false);
      }, [qnObj])

      return (
         <QnContext.Provider value={{
            McqCategory,
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
