'use client';


// ############################################################################


import React, { createContext, useState, useEffect, useContext } from "react";

import { shuffle, range } from "lodash";

import { notFound } from "next/navigation";

import LoadingSpinner from "@/app/ui/LoadingSpinner";

import ErrorContainer from "@/app/ui/ErrorContainer";

import { 
   QuestionContextProviderValueType, 
   QnObjType,
   initialContextValue
} from "@/lib/types";


// ############################################################################


const QnContext = createContext<QuestionContextProviderValueType>(initialContextValue);

export const useGEP_VOCAB_QnContext = () => useContext(QnContext);


// ############################################################################


export function GEP_VOCAB_QnProvider({ children, slug }: { children: React.ReactNode, slug: string } ) {


   const [orderOfQnsArray, setOrderOfQnsArray] = useState<number[]>([]);
   const [orderOfQnsArrayIdx, setOrderOfQnsArrayIdx] = useState<number>(0);
   const [qnObj, setQnObj] = useState<QnObjType | null>(null);
   const [qnSet, setQnSet] = useState<string>('');

   const [numQnsAns, setNumQnsAns] = useState<number>(0);
   const [numCorrectAns, setNumCorrectAns] = useState<number>(0);
   const [wrongAnsArr, setWrongAnsArr] = useState<QnObjType[]>([]);

   const [isNextQnBtnDisabled, setIsNextQnBtnDisabled] = useState<boolean>(true);
   const [isExplBtnDisabled, setIsExplBtnDisabled] = useState<boolean>(true);
   const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

   const [isFetching, setIsFetching] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);


   // ################################################################

   
   useEffect(() => {
      setIsFetching(true);

      // console.log("STARTING UP GEP VOCAB TEST");
      let randArr;

      switch (slug) {
         case undefined:
            randArr = shuffle(range(1, 601));
            setOrderOfQnsArray(randArr);
            setQnSet('All Qns');
            // console.log(
            //    "ALL QNS CHOSEN\n",
            //    "ORDER:", 
            //    randArr.slice(0, 10).join(','),
            //    "..."
            // );
            break;
         case "set1":
            randArr = shuffle(range(1, 101));
            setOrderOfQnsArray(randArr);
            setQnSet('Set 1');
            // console.log(
            //    "SET 1 CHOSEN\n",
            //    "ORDER:", 
            //    randArr.slice(0, 10).join(','),
            //    "..."
            // );
            break;
         case "set2":
            randArr = shuffle(range(101, 201));
            setOrderOfQnsArray(randArr);
            setQnSet('Set 2');
            // console.log(
            //    "SET 2 CHOSEN\n",
            //    "ORDER:", 
            //    randArr.slice(0, 10).join(','),
            //    "..."
            // );
            break;
         case "set3":
            randArr = shuffle(range(201, 301));
            setOrderOfQnsArray(randArr);
            setQnSet('Set 3');
            // console.log(
            //    "SET 3 CHOSEN\n",
            //    "ORDER:", 
            //    randArr.slice(0, 10).join(','),
            //    "..."
            // );
            break;
         case "set4":
            randArr = shuffle(range(301, 401));
            setOrderOfQnsArray(randArr);
            setQnSet('Set 4');
            // console.log(
            //    "SET 4 CHOSEN\n",
            //    "ORDER:", 
            //    randArr.slice(0, 10).join(','),
            //    "..."
            // );
            break;
         case "set5":
            randArr = shuffle(range(401, 501));
            setOrderOfQnsArray(randArr);
            setQnSet('Set 5');
            // console.log(
            //    "SET 5 CHOSEN\n",
            //    "ORDER:", 
            //    randArr.slice(0, 10).join(','),
            //    "..."
            // );
            break;
         case "set6":
            randArr = shuffle(range(501, 601));
            setOrderOfQnsArray(randArr);
            setQnSet('Set 6');
            // console.log(
            //    "SET 6 CHOSEN\n",
            //    "ORDER:", 
            //    randArr.slice(0, 10).join(','),
            //    "..."
            // );
            break;
         default:
            return notFound();
      }
   }, []);

   
   async function fetchNewQnObj() {
      setIsFetching(true);
      setQnObj(null);

      let qnNumToFetch = orderOfQnsArray[orderOfQnsArrayIdx];

      try {
         await new Promise((resolve) => setTimeout(resolve, 300));

         const res = await fetch(`../api/questions?collection=gep_vocab&qnNum=${qnNumToFetch}`);

         if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error);
         };

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

         // console.log("NOW DISPLAYING QUESTION", qnNum);
      }
   };
   
   
   // ################################################################
   

   useEffect(() => {
      if (orderOfQnsArray.length !== 0) {
         fetchNewQnObj();
      }
   }, [orderOfQnsArray, orderOfQnsArrayIdx]);
   
   function handleOptionClick(isCorrect: boolean) {
   // console.log(
   //    'AN OPTION BUTTON CLICKED:', 
   //    isCorrect ? "CORRECT" : "INCORRECT"
   // );
         
      setIsNextQnBtnDisabled(false);
      setIsExplBtnDisabled(false);
      setIsCorrect(isCorrect);
   };
      
   function handleNextQnBtnClick() {
   // console.log('NEXT QN BUTTON CLICKED');

      setIsNextQnBtnDisabled(true);
      setIsExplBtnDisabled(true);
      setIsCorrect(null);

      setNumQnsAns(prevNum => prevNum + 1);

      if (isCorrect) {
         setNumCorrectAns(prevNum => prevNum + 1);
      } else {
         qnObj && setWrongAnsArr(prevArr => [...prevArr, qnObj]);
      };
      
      if (orderOfQnsArrayIdx === orderOfQnsArray.length - 1) {
         setOrderOfQnsArrayIdx(0);
      } else {
         setOrderOfQnsArrayIdx(prev => prev + 1);
      };
   };


   // ################################################################

   
   const contextValue: QuestionContextProviderValueType = {
      qnObj,
      qnSet,
      handleOptionClick,
      isCorrect,
      isExplBtnDisabled,
      isNextQnBtnDisabled,
      handleNextQnBtnClick,
      numQnsAns,
      numCorrectAns,
      wrongAnsArr
   };
   
   if (isFetching) return <LoadingSpinner/>;

   if (error) return (
      <ErrorContainer>
         Error: {error}
      </ErrorContainer>
   );

   return (
      <QnContext.Provider value={contextValue}>
         {children}
      </QnContext.Provider>
   );
};