"use client";

import React, { useState, useEffect, createContext, useContext, useCallback } from "react";

import { Question, EMPTY_QUESTION, Collections, QuestionContextVal } from "@/definitions";

import { fetchUser, updateUserQuestionsData } from "@/lib/mongodb/user-server-actions";
import toast from "react-hot-toast";
import { fetchQuestion } from "@/lib/mongodb/question-server-actions";

// create context, fallback is null (which will throw error)
const QuestionContext = createContext<QuestionContextVal | null>(null);

// create hook to use context
export function useQuestionContext() {
   const ctx = useContext(QuestionContext);

   if (ctx === null) {
      throw new Error("useQuestionContext must be used within a QuestionProvider")
   };

   return ctx;
}

export function QuestionProvider({ 
   collection,
   qnNumArray,
   email,
   isRedoWrongQns,
   children,
}: { 
   collection: Collections,
   qnNumArray: number[],
   email: string | null,
   isRedoWrongQns: boolean,
   children: React.ReactNode
}): React.ReactNode {

   // all necessary states
   const [qnSequence, setQnSequence] = useState<number[]>(qnNumArray);
   const [qnObj, setQnObj] = useState<Question>(EMPTY_QUESTION);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
   const [numCorrect, setNumCorrect] = useState<number>(0);
   const [numAttempted, setNumAttempted] = useState<number>(0);
   const [userPoints, setUserPoints] = useState<number>(NaN);
   const [wronglyAnswered, setWronglyAnswered] = useState<Question[]>([]);
   const [hasReachedEnd, setHasReachedEnd] = useState<boolean>(false);

   const handleAttempt = useCallback((rw: boolean, currQnObj: Question) => {
      // set isCorrect to whether the user's answer is correct (rw means right/wrong)
      // (if isCorrect is null, user has not clicked any option yet)
      setIsCorrect(rw);

      if (rw) {
         // if correct, increment both right correct count and total attempted count
         setNumCorrect(prev => prev + 1);
         setNumAttempted(prev => prev + 1);
         toast.success("Correct!");
      } else {
         // if wrong, increment total attempted count only
         setNumAttempted(prev => prev + 1);
         // add the question to wronglyAnswered
         setWronglyAnswered(prev => [...prev, currQnObj]);

         toast.error("Sorry, that was incorrect.");
      }

      // if email is not empty, and not doing demo, update user profile
      if (email && collection !== "demo") {

         // run server action to update user's question data
         // increment score by 10 if user was correct
         // add the question number to wrongQnNums if user was wrong
         updateUserQuestionsData({
            email,
            collection,
            wrongQnNum: rw ? null : currQnObj.qnNum,
         })
         .then(res => {
            if (res.error!) {
               toast.error(res.error!);
               return;
            };
            // if no error, and the user was correct, 
            // we increment the userPoints state by 10
            // should always match the user's score in the database (by right)
            if (rw) setUserPoints(prev => prev + 10);
         });

      }
   }, [collection, email])

   const redoSet = useCallback(() => {
      // reset all states to initial values
      setWronglyAnswered([]);
      setNumAttempted(0);
      setNumCorrect(0);
      setIsCorrect(null);
      setIsLoading(true);
      setHasReachedEnd(false);
      setQnSequence(qnNumArray);
      toast.success("Questions reset");
   }, [qnNumArray])
   
   const handleNextQnBtnClick = useCallback(() => {
      // reset isCorrect to null, so that the user can click on the options again
      // set isLoading to true, so that the loading spinner is shown
      // remove the first element from qnSequence, so that the next question is fetched
      setIsLoading(true);
      setIsCorrect(null);
      setQnSequence(prev => prev.slice(1));
   }, [])

   useEffect(() => {
      // if user data has to be used and updated, 
      // fetch user profile to get user points.
      // only need to run once at the start,
      // then we can just update the userPoints state
      if (email && collection !== "demo") {
         fetchUser(email, "profile").then(res => {
            if ("error" in res) {
               toast.error(res.error!);
               return;
            }
            setUserPoints(res.score);
         });
      }
   }, [collection, email])

   useEffect(() => {
      // listens to changes in qnSequence,
      // fetches the next question (qnSequence[0]) when qnSequence changes

      const fetchData = async() => {
         // set qnObj to an empty object
         setQnObj(EMPTY_QUESTION);
   
         if (qnSequence.length === 0) {
            // if there are no more questions to fetch, set hasReachedEnd to true and return
            setHasReachedEnd(true);
            return;
         }

         try {
            // run server action:
            // fetch qn based on category (which is the mongo collection) and current question number (qnSequence[0])
            const res = await fetchQuestion(collection, qnSequence[0]);

            if (process.env.NODE_ENV === "development") {
               // fake delay for development purposes
               await new Promise(r => setTimeout(r, 500));
            }
         
            // set qnObj to the fetched mcq object if no error
            "error" in res ? toast.error(res.error!) : setQnObj(res[0]);
         } catch (err) {
            toast.error(err instanceof Error ? err.message : "An unknown error occurred");
         }
      };

      fetchData();
   }, [qnSequence, collection])

   useEffect(() => {
      // if qnNum is not NaN, it means the qnObj has been set (not the empty one)
      // so we set isLoading to false
      // this is to prevent an empty question from being displayed
      // however, it seems people hate multiple useEffects for some reason (???) idk
      if (!Number.isNaN(qnObj.qnNum)) setIsLoading(false);
   }, [qnObj])

   const contextValue: QuestionContextVal = {
      // the category of the question set
      collection,

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
         // whether we are redoing wrong questions
         isRedoWrongQns,
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
         wronglyAnswered,
      },

      callbacks: {
         // callback when user clicks an option
         handleAttempt,
         // callback when user clicks next question
         handleNextQnBtnClick,
         // callback when user clicks on the redo button at the end
         redoSet
      }
   }

   return (
      <QuestionContext.Provider
         value={contextValue}
      >
         {children}
      </QuestionContext.Provider>
   );
}
