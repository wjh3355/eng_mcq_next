"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { shuffle, range } from "lodash";
import { notFound } from "next/navigation";
import LoadingSpinner from "@/app/ui/utils/LoadingSpinner";
import ErrorContainer from "@/app/ui/utils/ErrorContainer";
import {
   GenericMCQContextValueType,
   QnObjType,
   initialContextValue,
} from "@/lib/types";

export function createGenericMCQProvider(
   questionCategory: string,
   qnCategoryAllowedConfigs: any
) {

   const QnContext = createContext<GenericMCQContextValueType>(initialContextValue);

   const useGenericMCQContext = () => useContext(QnContext);

   function GenericMCQProvider({
      children,
      slug,
   }: {
      children: React.ReactNode;
      slug: string[] | undefined;
   }) {

      const [qnOrderArray, setQnOrderArray] = useState<number[]>([]);
      const [qnOrderArrayIdx, setQnOrderArrayIdx] = useState<number>(0);
      const [isFetching, setIsFetching] = useState<boolean>(true);
      const [error, setError] = useState<string | null>(null);

      const [qnObj, setQnObj] = useState<QnObjType | null>(null);
      const [qnSet, setQnSet] = useState<string>("");
      const [isNextQnBtnDisabled, setIsNextQnBtnDisabled] = useState<boolean>(true);
      const [isExplBtnDisabled, setIsExplBtnDisabled] = useState<boolean>(true);
      const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
      const [numQnsAns, setNumQnsAns] = useState<number>(0);
      const [numCorrectAns, setNumCorrectAns] = useState<number>(0);
      const [wrongAnsArr, setWrongAnsArr] = useState<QnObjType[]>([]);


      function setUpQuiz() {
         const joinedSlug = slug?.join("");
         const config = qnCategoryAllowedConfigs[
            joinedSlug as keyof typeof qnCategoryAllowedConfigs];

         if (!config) return notFound();

         const [start, end] = config.range;
         const randArr = shuffle(range(start, end));

         setQnOrderArray(randArr);
         setQnSet(config.setName);
      }

      async function fetchNewQnObj() {
         setIsFetching(true);
         setQnObj(null);

         let qnNumToFetch = qnOrderArray[qnOrderArrayIdx];

         try {
            await new Promise((resolve) => setTimeout(resolve, 300));

            const res = await fetch(
               `../api/questions?collection=${questionCategory}&qnNum=${qnNumToFetch}`
            );

            if (!res.ok) {
               const errorData = await res.json();
               throw new Error(errorData.error);
            }

            const data = await res.json();

            setQnObj(data);
         } catch (err) {
            if (err instanceof Error) {
               console.error(err);
               setError(err.message);
            } else {
               console.error("An unknown error occurred");
               setError("An unknown error occurred");
            }
         } finally {
            setIsFetching(false);
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

         if (qnOrderArrayIdx === qnOrderArray.length - 1) {
            setQnOrderArrayIdx(0);
         } else {
            setQnOrderArrayIdx(prev => prev + 1);
         }
      }

      useEffect(() => {
         setUpQuiz();
      }, []);

      useEffect(() => {
         if (qnOrderArray.length !== 0) {
            fetchNewQnObj();
         }
      }, [qnOrderArray, qnOrderArrayIdx]);

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
      };

      if (isFetching) return <LoadingSpinner />;

      if (error) return <ErrorContainer>Error: {error}</ErrorContainer>;

      return <QnContext.Provider value={contextValue}>{children}</QnContext.Provider>;
      
   };

   return { GenericMCQProvider, useGenericMCQContext };
}
