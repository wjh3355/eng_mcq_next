'use client';


// ############################################################################


import { createContext, useState, useEffect, useContext } from "react";
import { pick, shuffle, range } from "lodash";

import { notFound } from "next/navigation";

import LoadingSpinner from "@/app/ui/LoadingSpinner";

import ErrorContainer from "@/app/ui/ErrorContainer";


// ############################################################################


const GEPQnContext = createContext();

export const useGEPQnContext = () => useContext(GEPQnContext);


// ############################################################################


export function GEPQnProvider({ children, slug }) {


   const [orderOfQnsArray, setOrderOfQnsArray] = useState([]);
   const [orderOfQnsArrayIdx, setOrderOfQnsArrayIdx] = useState(0);
   const [qnObj, setQnObj] = useState(null);
   const [qnSet, setQnSet] = useState('');

   const [numQnsAns, setNumQnsAns] = useState(0);
   const [numCorrectAns, setNumCorrectAns] = useState(0);
   const [wrongAnsArr, setWrongAnsArr] = useState([]);

   const [isNextQnBtnDisabled, setIsNextQnBtnDisabled] = useState(true);
   const [isExplBtnDisabled, setIsExplBtnDisabled] = useState(true);
   const [isCorrect, setIsCorrect] = useState(null);

   const [isFetching, setIsFetching] = useState(true);
   const [error, setError] = useState(null);


   // ################################################################

   
   useEffect(() => {
      setIsFetching(true);

      // console.log("STARTING UP GEP MCQ TEST");
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
         await new Promise(resolve => setTimeout(resolve, 400));
         // Fake delay
         
         const res = await fetch(`../api/questions?qnNum=${qnNumToFetch}`);
         
         if (!res.ok) throw new Error("Failed to fetch data, response was not OK");
         
         const data = await res.json();
         
         if (!data) throw new Error(`Question number #${qnNumToFetch} could not be fetched.`);
         
         setQnObj(data);
      } catch (err) {
         console.log(err);
         setError(err.message);
      } finally {
         setIsFetching(false);
         // console.log("NOW DISPLAYING QUESTION", qnNum);
      }
   };
   
   
   // ################################################################
   

   useEffect(() => {
      orderOfQnsArray.length !== 0 && fetchNewQnObj();
   }, [orderOfQnsArray, orderOfQnsArrayIdx]);
   
   function handleOptionClick(isCorrect) {
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
      // reset states

      setNumQnsAns(prevNum => prevNum + 1);

      if (isCorrect) {
         setNumCorrectAns(prevNum => prevNum + 1);
      } else {
         setWrongAnsArr(prevArr => [...prevArr, pick(qnObj, [
            'sentence', 'wordToTest', 'rootWord', 'def'
         ])]);
      };
      // before update isCorrect back to null, 
      // increment numCorrectAns if it is true,
      // if not add some of the values in qnObj to wrongQnsArr

      
      if (orderOfQnsArrayIdx === orderOfQnsArray.length - 1) {
         setOrderOfQnsArrayIdx(0);
      } else {
         setOrderOfQnsArrayIdx(prev => prev + 1);
      };
      // update orderOfQnsArrayIdx to get next question
   };


   // ################################################################

   
   const contextValue = {
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
      <GEPQnContext.Provider value={contextValue}>
         {children}
      </GEPQnContext.Provider>
   );
};