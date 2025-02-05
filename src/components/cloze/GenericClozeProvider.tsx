"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { ClozeContextValue, ClozeObj, EMPTY_CLOZE_CONTEXT_VALUE, UserProfileDocument } from '@/definitions';
import axios, { AxiosError } from "axios";

export default function createGenericClozeProvider({
   user,
   qnNum,
   isDemo
}: { 
   user: UserProfileDocument
   qnNum: number,
   isDemo: boolean
}) {

   const QnContext = createContext<ClozeContextValue>(EMPTY_CLOZE_CONTEXT_VALUE);

   function useClozeContext() { 
      return useContext(QnContext);
   }

   function ClozeProvider({ children }: { children: React.ReactNode }) {

      const [prevUserCorrectAns, setPrevUserCorrectAns] = useState<null | number[]>(null);
      const [passageTitle, setPassageTitle] = useState<string>("");
      const [wordsToTestArr, setWordsToTestArr] = useState<string[][]>([]);
      const [textArr, setTextArr] = useState<string[]>([]);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [error, setError] = useState<string>("");

      function handleCompletion(correctAns: number[]) {

         if (isDemo) {
            setPrevUserCorrectAns(correctAns);
            return;
         }

         axios
            .post(
               "/api/user/update-profile-data",
               {
                  email: user.email,
                  action: {
                     todo: "update cloze",
                     clozeQnNum: qnNum,
                     correctAns
                  }
               }
            )
            .then(() => {})
            .catch((err: AxiosError<{ error: string }>) => 
               setError(err.response?.data.error ?? "An unknown error occurred")
            )
      }

      function handleReset() {

         if (isDemo) {
            setPrevUserCorrectAns(null);
            return;
         }

         axios
            .post(
               "/api/user/update-profile-data",
               {
                  email: user.email,
                  action: {
                     todo: "update cloze",
                     clozeQnNum: qnNum,
                     correctAns: null
                  }
               }
            )
            .then(() => window.location.reload())
            .catch((err: AxiosError<{ error: string }>) => 
               setError(err.response?.data.error ?? "An unknown error occurred")
            )
      }

      useEffect(() => {

         if (isDemo) {

            axios
               .get("/api/qns/get-demo-cloze-qn")
               .then(res => {
                  const clozeObj: ClozeObj = res.data.clozeObj;

                  setWordsToTestArr(
                     clozeObj.passage
                        .match(/\{[^}]*\}/g)!
                        .map(match => match
                           .slice(1, -1)
                           .split("/")
                           .filter(Boolean)
                        )
                  );
         
                  setTextArr(
                     clozeObj.passage
                        .replace(/{.*?}/g, "BLANK")
                        .split(/(BLANK|\|\|)/)
                        .filter(Boolean)
                  );
         
                  setPassageTitle(clozeObj.title);
               })
               .catch((err: AxiosError<{ error: string }>) => 
                  setError(err.response?.data.error ?? "An unknown error occurred")
               )

         } else {

            const userDataForCurrentCloze = user.clozeData.find(cz => cz.qnNum === qnNum);
            setPrevUserCorrectAns(userDataForCurrentCloze?.correctAns || null);

            axios
               .get(
                  "/api/qns/get-cloze-qn",
                  { params: { qnNum } }
               )
               .then(res => {
                  const clozeObj: ClozeObj = res.data.clozeObj;
   
                  setWordsToTestArr(
                     clozeObj.passage
                        .match(/\{[^}]*\}/g)!
                        .map(match => match
                           .slice(1, -1)
                           .split("/")
                           .filter(Boolean)
                        )
                  );
         
                  setTextArr(
                     clozeObj.passage
                        .replace(/{.*?}/g, "BLANK")
                        .split(/(BLANK|\|\|)/)
                        .filter(Boolean)
                  );
         
                  setPassageTitle(clozeObj.title);
               })
               .catch((err: AxiosError<{ error: string }>) => 
                  setError(err.response?.data.error ?? "An unknown error occurred")
               )
         }

      }, [])

      useEffect(() => {
         if (
            passageTitle.length > 0
            && textArr.length > 0
            && wordsToTestArr.length > 0
         ) setIsLoading(false);
      }, [passageTitle, textArr, wordsToTestArr])

      return (
         <QnContext.Provider value={{
            isDemo,
            prevUserCorrectAns,
            wordsToTestArr,
            textArr,
            qnNum,
            passageTitle,
            isLoading,
            error,
            handleCompletion,
            handleReset
         }}>
            {children}
         </QnContext.Provider>
      );
   }

   return { useClozeContext, ClozeProvider };

}
