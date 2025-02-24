"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

import { DefinitionContextValue, EMPTY_DEFINITION_CONTEXT_VALUE, EMPTY_DEFINITION_QN_OBJ, DefinitionQnObj } from "@/definitions";

import { fetchUser, updateUserProfile } from "@/lib/mongodb/user-server-actions";
import toast from "react-hot-toast";
import { fetchDefinition } from "@/lib/mongodb/definition-server-actions";

// create context, fallback is an empty context value
const ThisContext = createContext<DefinitionContextValue>(EMPTY_DEFINITION_CONTEXT_VALUE);

// create hook to use context
export function useDefinitionContext() {
   const ctx = useContext(ThisContext);

   if (ctx === EMPTY_DEFINITION_CONTEXT_VALUE) {
      throw new Error("useDefinitionContext must be used within a DefinitionProvider")
   };

   return ctx;
}

// create provider component
export default function DefinitionProvider({
   qnNumArray,
   email,
   children
}: {
   qnNumArray: number[],
   email: string,
   children: React.ReactNode
}) {

   // all necessary states
   const [qnSequence, setQnSequence] = useState<number[]>(qnNumArray);
   const [qnObj, setQnObj] = useState<DefinitionQnObj>(EMPTY_DEFINITION_QN_OBJ);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
   const [numCorrect, setNumCorrect] = useState<number>(0);
   const [numAttempted, setNumAttempted] = useState<number>(0);
   const [userPoints, setUserPoints] = useState<number>(NaN);
   const [wrongAnsArr, setWrongAnsArr] = useState<DefinitionQnObj[]>([]);
   const [hasReachedEnd, setHasReachedEnd] = useState<boolean>(false);

   function handleOptionClick(rw: boolean) {
      // set isCorrect to whether the user's answer is correct (rw means right/wrong)
      // (if isCorrect is null, user has not clicked any option yet)
      setIsCorrect(rw);

      if (rw) {
         // if correct, increment both right correct count and total attempted count
         setNumCorrect(prev => prev + 1);
         setNumAttempted(prev => prev + 1);
         toast.success("Correct! Well done.");
      } else {
         // if wrong, increment total attempted count only
         setNumAttempted(prev => prev + 1);
         // if the question is not already in wrongAnsArr, add it
         if (!wrongAnsArr.some(existingQnObj => existingQnObj.qnNum === qnObj.qnNum)) {
            setWrongAnsArr(prevArr => [qnObj, ...prevArr]);
         }
         toast.error("Sorry, that was incorrect.");
      }

      // if email is not empty, update user profile with the user's answer
      if (email) {
         // todo states that the user is updating spelling
         // in all cases, increment numQnsAttempted
         // if correct, increment score by 10
         // if wrong, add the question to wrongAnsArr
         // updateUserProfile(email, {
         //    todo: "update spelling",
         //    spellingQnNum: qnObj.qnNum,
         //    isSpellingCorrect: rw
         // })
         // .then(res => {
         //    if (res.error) {
         //       toast.error(res.error);
         //       return;
         //    };
         //    // if no error, and the user was correct, 
         //    // we increment the userPoints state by 10
         //    // should always match the user's score in the database (by right)
         //    if (rw) setUserPoints(prev => prev + 10);
         // });
      }
   }

   function redoSet() {
      // reset all states to initial values
      setWrongAnsArr([]);
      setNumAttempted(0);
      setNumCorrect(0);
      setIsCorrect(null);
      setIsLoading(true);
      setHasReachedEnd(false);
      setQnSequence(qnNumArray);
      toast.success("Questions reset");
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
         setQnObj(EMPTY_DEFINITION_QN_OBJ);
   
         if (qnSequence.length === 0) {
            // if there are no more questions to fetch, set hasReachedEnd to true and return
            setHasReachedEnd(true);
            return;
         }

         try {
            // run server action:
            // fetch spelling qn based on current question number (qnSequence[0])
            const res = await fetchDefinition(qnSequence[0]);
         
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
         // the actual question object
         qnObj,

         // loading state
         isLoading,

         setInfo: {
            // number of questions in the set
            numQnsInSet: qnNumArray.length,
            // current question number (whether attempted or not)
            currQnNum: qnNumArray.length - qnSequence.length + 1,
            // whether the user has reached the end of the set
            hasReachedEnd,
         },

         userInfo: {
            // user's points from db
            userPoints,
            // number of questions the user has gotten correct
            numCorrect,
            // number of questions the user has attempted
            numAttempted,
            // current answer state
            isCorrect,
            // array of questions the user has gotten wrong
            wrongAnsArr,
         },

         callbacks: {
            // callback when user clicks an option
            handleOptionClick,
            // callback when user clicks next question
            handleNextQnBtnClick,
            // callback when user clicks on the redo button at the end
            redoSet
         }

      }}>
         {children}
      </ThisContext.Provider>
   );

}
