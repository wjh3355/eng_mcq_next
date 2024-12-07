"use client";

import React, { createContext, useState, useEffect, useContext, useCallback } from "react";

import { ClozeContextValue, ClozeObj, EMPTY_CLOZE_CONTEXT_VALUE, EMPTY_CLOZE_OBJ } from "@/types";

import fetchClozeFromDB from "@/serverFuncs/fetchClozeFromDB";

export default function createGenericClozeProvider({
   qnNumArray,
}: {
   qnNumArray: number[],
}) {

   const QnContext = createContext<ClozeContextValue>(EMPTY_CLOZE_CONTEXT_VALUE);

   function useClozeContext() { 
      return useContext(QnContext);
   }

   function ClozeProvider({ children }: { children: React.ReactNode }) {

      const [qnSequence, setQnSequence] = useState<number[]>(qnNumArray);
      const [clozeObj, setClozeObj] = useState<ClozeObj>(EMPTY_CLOZE_OBJ);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [error, setError] = useState<string>("");
      const [hasReachedEnd, setHasReachedEnd] = useState<boolean>(false);
      
      function handleNextQnBtnClick() {
         setIsLoading(true);
         setQnSequence(prev => prev.slice(1));
      }

      const fetchNewclozeObj = useCallback(async () => {
         setClozeObj(EMPTY_CLOZE_OBJ);

         if (qnSequence.length === 0) {
            setHasReachedEnd(true);
         } else {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            try {
               setClozeObj(await fetchClozeFromDB(qnSequence[0]));
            } catch (error) {
               if (error instanceof Error) {
                  console.error("Error when fetching new clozeObj:", error.message);
                  setError(error.message);
               } else {
                  console.error("An unexpected error occurred:", error);
                  setError("An unexpected error occurred");
               }
            }
         }

      }, [qnSequence]);

      useEffect(() => {fetchNewclozeObj()}, [fetchNewclozeObj])

      useEffect(() => {
         if (!Number.isNaN(clozeObj.qnNum)) setIsLoading(false);
      }, [clozeObj])

      return (
         <QnContext.Provider value={{
            clozeObj,
            isLoading,
            error,
            hasReachedEnd,
            handleNextQnBtnClick,
         }}>
            {children}
         </QnContext.Provider>
      );
   }

   return { ClozeProvider, useClozeContext };
}
