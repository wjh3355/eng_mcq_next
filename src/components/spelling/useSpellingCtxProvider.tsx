"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

import { SpellingQnObj, EMPTY_SPELLING_QN_OBJ, SpellingContextValue, EMPTY_SPELLING_CONTEXT_VALUE } from '@/definitions';

import { fetchSpelling } from "@/lib/mongodb/spelling-server-actions";
import toast from "react-hot-toast";
import { fetchUser, updateUserProfile } from "@/lib/mongodb/user-server-actions";

export default function useSpellingCtxProvider({ 
   qnNumArray,
   email,
   setInfo,
   isRandom
}: { 
   qnNumArray: number[],
   email: string,
   setInfo: [number, number],
   isRandom: boolean
}) {

   // create context, fallback is an empty context value
   const ThisContext = createContext<SpellingContextValue>(EMPTY_SPELLING_CONTEXT_VALUE);

   // create hook to use context
   function useSpellingContext() { return useContext(ThisContext) }

   // create provider component
   function SpellingProvider({ children }: { children: React.ReactNode }) {

      const [qnSequence, setQnSequence] = useState<number[]>(qnNumArray);
      const [qnObj, setQnObj] = useState<SpellingQnObj>(EMPTY_SPELLING_QN_OBJ);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
      const [thisSessionScore, setThisSessionScore] = useState<[number, number]>([0, 0]);
      const [userPoints, setUserPoints] = useState<number>(NaN);
      const [wrongAnsArr, setWrongAnsArr] = useState<SpellingQnObj[]>([]);
      const [hasReachedEnd, setHasReachedEnd] = useState<boolean>(false);

      function handleAttempt(rw: boolean) {
         // rw: whether the user's answer is correct
         // if isCorrect is null, it means the user has not clicked any option yet
         // so we set isCorrect to whether the user's answer is correct
         setIsCorrect(rw);

         if (rw) {
            // if correct, increment both right answers count and total questions count
            toast.success("Correct! Well done.");
            setThisSessionScore(([right, tot]) => [right+1, tot+1]);
         } else {
            // if wrong, increment total questions count only
            toast.error("Sorry, that was incorrect. Try the next question.");
            setThisSessionScore(([right, tot]) => [right, tot+1]);
            // if the question is not already in wrongAnsArr, add it
            if (!wrongAnsArr.some(existingQnObj => existingQnObj.qnNum === qnObj.qnNum)) {
               setWrongAnsArr(prevArr => [qnObj, ...prevArr]);
            }
         }

         // if email is not empty, update user profile with the user's answer
         if (email) {
            // todo states that the user is updating spelling
            // in all cases, increment numQnsAttempted
            // if correct, increment score by 10
            // if wrong, add the question to wrongAnsArr
            updateUserProfile(email, {
               todo: "update spelling",
               spellingQnNum: qnObj.qnNum,
               isSpellingCorrect: rw
            })
            .then(res => {
               if (res.error) {
                  toast.error(res.error);
                  return;
               };
               // if no error, and the user was correct, 
               // we increment the userPoints state by 10
               // should always match the user's score in the database (by right)
               if (rw) setUserPoints(prev => prev + 10);
            });
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
         // reset isCorrect to null --> qn state back to unanswered
         // set isLoading to true --> loading spinner is shown
         // remove the first element from qnSequence, so that the next question is fetched
         setIsLoading(true);
         setIsCorrect(null);
         setQnSequence(prev => prev.slice(1));
      }

      useEffect(() => {
         // if user data has to be used and updated, 
         // fetch user profile to get user points.
         // only need to run once at the start,
         // then we can just update the userPoints state
         if (email) {
            fetchUser(email, "profile").then(res => {
               if ("error" in res) {
                  toast.error(res.error);
                  return;
               }
               setUserPoints(res.score);
            });
         }
      }, [])

      useEffect(() => {
         // listens to changes in qnSequence,
         // fetches the next question (qnSequence[0]) when qnSequence changes

         const fetchData = async() => {
            // set qnObj to an empty object
            setQnObj(EMPTY_SPELLING_QN_OBJ);
      
            if (qnSequence.length === 0) {
               // if there are no more questions to fetch, set hasReachedEnd to true and return
               setHasReachedEnd(true);
               return;
            }

            try {
               // run server action:
               // fetch spelling qn based on current question number (qnSequence[0])
               const res = await fetchSpelling(qnSequence[0]);
            
               // set qnObj to the fetched mcq object if no error
               "error" in res ? toast.error(res.error) : setQnObj(res);
            } catch (err) {
               toast.error(err instanceof Error ? err.message : "An unknown error occurred");
            }
         };

         fetchData();
      }, [qnSequence])

      useEffect(() => {
         // if qnNum is not NaN, it means the qnObj has been set (not the empty one)
         // so we set isLoading to false
         // this is to prevent an empty question from being displayed
         // however, it seems people hate multiple useEffects for some reason (???) idk
         if (!Number.isNaN(qnObj.qnNum)) setIsLoading(false);
      }, [qnObj])

      return (
         <ThisContext.Provider value={{
            qnObj,
            isLoading,
            isCorrect,
            thisSessionScore,
            userPoints,
            wrongAnsArr,
            hasReachedEnd,
            isRandom,
            numQnsInSet: qnNumArray.length,
            currNum: qnNumArray.length - qnSequence.length + 1,
            setInfo,
            handleAttempt,
            handleNextQnBtnClick,
            redoSet
         }}>
            {children}
         </ThisContext.Provider>
      );
   }

   return { SpellingProvider, useSpellingContext };
}
