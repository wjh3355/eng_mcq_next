"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import shuffle from "lodash/shuffle";
import range from "lodash/range";
import isEqual from "lodash/isEqual";

import {
   GenericMCQContextValueType,
   QnObjType,
   QnSetIntervalsType,
   MongoCollectionNames,
   emptyContextValue,
   emptyQnObj
} from "@/lib/types";
import { fetchQnFromDB } from "@/lib/fetchQnFromDB";

export default function createGenericMCQProvider(
   collection: MongoCollectionNames,
   qnSetNameIntervals: QnSetIntervalsType
) {

   const QnContext = createContext<GenericMCQContextValueType>(emptyContextValue);

   function useGenericMCQContext() { 
      return useContext(QnContext);
   }

   function GenericMCQProvider({
      children,
      slug,
   }: {
      children: React.ReactNode;
      slug: string[] | undefined;
   }) {

      const [qnOrderArray, setQnOrderArray] = useState<number[]>([]);
      const [qnOrderArrayPtr, setQnOrderArrayPtr] = useState<number>(0);

      
      const [qnObj, setQnObj] = useState<QnObjType>(emptyQnObj);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [qnSetName, setQnSetName] = useState<string>("");
      const [isNextQnBtnDisabled, setIsNextQnBtnDisabled] = useState<boolean>(true);
      const [isExplBtnDisabled, setIsExplBtnDisabled] = useState<boolean>(true);
      const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
      const [numQnsAns, setNumQnsAns] = useState<number>(0);
      const [numCorrectAns, setNumCorrectAns] = useState<number>(0);
      const [wrongAnsArr, setWrongAnsArr] = useState<QnObjType[]>([]);
      const [error, setError] = useState<string>("");

      function handleOptionClick(isCorrect: boolean) {
         setIsNextQnBtnDisabled(false);
         setIsExplBtnDisabled(false);
         setIsCorrect(isCorrect);
         setNumQnsAns(prevNum => prevNum + 1);
         if (isCorrect) {
            setNumCorrectAns(prevNum => prevNum + 1);
         } else if (!wrongAnsArr.some(existingQnObj => isEqual(existingQnObj, qnObj))) {
            setWrongAnsArr(prevArr => [qnObj, ...prevArr]);
         }
      }

      function handleNextQnBtnClick() {
         setIsNextQnBtnDisabled(true);
         setIsExplBtnDisabled(true);
         setIsCorrect(null);
         setQnOrderArrayPtr(prev => (prev === qnOrderArray.length - 1) ? 0 : prev + 1);
         setIsLoading(true);
      }

      useEffect(() => {
         const joinedSlug = slug?.join("");
         const qnSetNameInterval = qnSetNameIntervals.find(set => set.slug === joinedSlug);

         if (qnSetNameInterval) {
            const [start, end] = qnSetNameInterval.range;
            setQnSetName(qnSetNameInterval.displayedName);
            setQnOrderArray(shuffle(range(start, end)));  
         } else {
            setQnSetName("Not Found");
            setError("Please choose a valid question set from the dropdown menu");
         }

      }, [slug])

      useEffect(() => {
         async function fetchNewQnObj() {
            setQnObj(emptyQnObj);
   
            const qnNumToFetch = qnOrderArray[qnOrderArrayPtr];
   
            try {
               await new Promise((resolve) => setTimeout(resolve, 100));
   
               setQnObj(await fetchQnFromDB(collection, qnNumToFetch));
   
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

         if (qnOrderArray.length !== 0) fetchNewQnObj();
      }, [qnOrderArray, qnOrderArrayPtr])

      useEffect(() => {
         if (!isEqual(qnObj, emptyQnObj)) setIsLoading(false);
      }, [qnObj])

      const contextValue: GenericMCQContextValueType = {
         qnObj,
         isLoading,
         qnSetName,
         handleOptionClick,
         isCorrect,
         isExplBtnDisabled,
         isNextQnBtnDisabled,
         handleNextQnBtnClick,
         numQnsAns,
         numCorrectAns,
         wrongAnsArr,
         error
      }

      return (
         <QnContext.Provider value={contextValue}>
            {children}
         </QnContext.Provider>
      );
      
   }

   return { GenericMCQProvider, useGenericMCQContext };
}
