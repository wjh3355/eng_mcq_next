"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { shuffle, range } from "lodash";
import { notFound } from "next/navigation";

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
            await new Promise((resolve) => setTimeout(resolve, 200));

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
         } else {
            qnObj && setWrongAnsArr(prevArr => [...prevArr, qnObj]);
         }
      }

      function handleNextQnBtnClick() {
         setIsNextQnBtnDisabled(true);
         setIsExplBtnDisabled(true);
         setIsCorrect(null);

         if (qnOrderArrayPtr === qnOrderArray.length - 1) {
            setQnOrderArrayPtr(0);
         } else {
            setQnOrderArrayPtr(prev => prev + 1);
         }
      }

      useEffect(() => {
         const joinedSlug = slug?.join("");
         const config = qnCategorySets[
            joinedSlug as keyof typeof qnCategorySets];

         if (!config) return notFound();

         const [start, end] = config.range;
         const randArr = shuffle(range(start, end));
         console.log(randArr.slice(0, 10).join(', '));

         setQnOrderArray(randArr);
         setQnSet(config.setName);
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
