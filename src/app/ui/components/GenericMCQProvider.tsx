"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import shuffle from "lodash/shuffle";
import range from "lodash/range";
import isEqual from "lodash/isEqual";

import {
   GenericMCQContextValueType,
   QnObjType,
   AllowedQuestionCategories,
   AllowedSetConfigsType,
   emptyContextValue,
   emptyQnObj
} from "@/lib/types";
import { fetchQnFromDB } from "@/lib/fetchQnFromDB";

export function createGenericMCQProvider(
   questionCategory: AllowedQuestionCategories,
   qnCategorySets: AllowedSetConfigsType
) {

   const QnContext = createContext<GenericMCQContextValueType>(emptyContextValue);

   const useGenericMCQContext = () => useContext(QnContext);

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
      const [qnSet, setQnSet] = useState<string>("");
      const [isNextQnBtnDisabled, setIsNextQnBtnDisabled] = useState<boolean>(true);
      const [isExplBtnDisabled, setIsExplBtnDisabled] = useState<boolean>(true);
      const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
      const [numQnsAns, setNumQnsAns] = useState<number>(0);
      const [numCorrectAns, setNumCorrectAns] = useState<number>(0);
      const [wrongAnsArr, setWrongAnsArr] = useState<QnObjType[]>([]);
      const [error, setError] = useState<string | null>(null);

      async function fetchNewQnObj() {
         setQnObj(emptyQnObj);

         let qnNumToFetch = qnOrderArray[qnOrderArrayPtr];

         try {
            await new Promise((resolve) => setTimeout(resolve, 150));

            setQnObj(await fetchQnFromDB(questionCategory, qnNumToFetch));

         } catch (error) {
            if (error instanceof Error) {
               console.error("Error when fetching new QnObj:", error.message);
               setError(error.message);
               
            } else {
               console.error("An unexpected error occurred");
               setError("An unexpected error occurred");

            }
         }
      }

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
      }

      useEffect(() => {
         const joinedSlug = slug?.join("");
         const config = qnCategorySets[
            joinedSlug as keyof typeof qnCategorySets];

         if (config) {
            const [start, end] = config.range;
            setQnSet(config.setName);
            setQnOrderArray(shuffle(range(start, end)));  
         } else {
            setQnSet("Not Found");
            setError("Please choose a valid question set from the dropdown menu");
         }

      }, []);

      useEffect(() => {
         if (qnOrderArray.length !== 0) fetchNewQnObj();
      }, [qnOrderArray, qnOrderArrayPtr]);

      const contextValue: GenericMCQContextValueType = {
         qnObj,
         qnSet,
         handleOptionClick,
         isCorrect,
         isExplBtnDisabled,
         isNextQnBtnDisabled,
         handleNextQnBtnClick,
         numQnsAns,
         numCorrectAns,
         wrongAnsArr,
         error
      };

      return (
         <QnContext.Provider value={contextValue}>
            {children}
         </QnContext.Provider>
      );
      
   };

   return { GenericMCQProvider, useGenericMCQContext };
}
