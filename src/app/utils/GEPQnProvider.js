'use client';

import { createContext, useState, useEffect, useContext } from "react";
import { fetchQnJson } from "./data";
import { pick, shuffle, range } from "lodash";
import { notFound } from "next/navigation";

import LoadingSpinner from "../ui/LoadingSpinner";

const GEPQnContext = createContext();

export const useGEPQnContext = () => useContext(GEPQnContext);

export function GEPQnProvider({ children, slug }) {
   const [qnOrderArr, setQnOrderArr] = useState([]);
   const [qnIdx, setQnIdx] = useState(0);
   const [qnObj, setQnObj] = useState(null);

   const [numQnsAns, setNumQnsAns] = useState(0);
   const [numCorrectAns, setNumCorrectAns] = useState(0);
   const [wrongAnsArr, setWrongAnsArr] = useState([]);

   const [isNextQnBtnDisabled, setIsNextQnBtnDisabled] = useState(true);
   const [isExplBtnDisabled, setIsExplBtnDisabled] = useState(true);
   const [isCorrect, setIsCorrect] = useState(null);

   const [isFetching, setIsFetching] = useState(true);
   
   useEffect(() => {
      console.log("STARTING UP GEP MCQ TEST");
      let randArr;
      const actualSlug = slug?.join('');
      switch (actualSlug) {
         case undefined:
            randArr = shuffle(range(1, 601));
            setQnOrderArr(randArr);
            console.log("ALL QNS CHOSEN");
            console.log(
               "ORDER:", 
               randArr.slice(0, 25).join(','),
               "..."
            );
            break;
         case "set1":
            randArr = shuffle(range(1, 101));
            setQnOrderArr(randArr);
            console.log("SET 1 CHOSEN");
            console.log(
               "ORDER:", 
               randArr.slice(0, 25).join(','),
               "..."
            );
            break;
         case "set2":
            randArr = shuffle(range(101, 201));
            setQnOrderArr(randArr);
            console.log("SET 2 CHOSEN");
            console.log(
               "ORDER:", 
               randArr.slice(0, 25).join(','),
               "..."
            );
            break;
         case "set3":
            randArr = shuffle(range(201, 301));
            setQnOrderArr(randArr);
            console.log("SET 3 CHOSEN");
            console.log(
               "ORDER:", 
               randArr.slice(0, 25).join(','),
               "..."
            );
            break;
         case "set4":
            randArr = shuffle(range(301, 401));
            setQnOrderArr(randArr);
            console.log("SET 4 CHOSEN");
            console.log(
               "ORDER:", 
               randArr.slice(0, 25).join(','),
               "..."
            );
            break;
         case "set5":
            randArr = shuffle(range(401, 501));
            setQnOrderArr(randArr);
            console.log("SET 5 CHOSEN");
            console.log(
               "ORDER:", 
               randArr.slice(0, 25).join(','),
               "..."
            );
            break;
         case "set6":
            randArr = shuffle(range(501, 601));
            setQnOrderArr(randArr);
            console.log("SET 6 CHOSEN");
            console.log(
               "ORDER:", 
               randArr.slice(0, 25).join(','),
               "..."
            );
            break;
         default:
            return notFound();
      }
   }, []);

   useEffect(() => {
      qnOrderArr.length !== 0 && fetchNewQnObj();
   }, [qnOrderArr, qnIdx]);
      
   async function fetchNewQnObj() {
      setIsFetching(true);
      setQnObj(null);

      await new Promise(resolve => setTimeout(resolve, 500));
      // Fake delay
      const data = await fetchQnJson(qnOrderArr[qnIdx]);
      console.log('NOW DISPLAYING QUESTION', qnOrderArr[qnIdx]);

      setQnObj(data);
      setIsFetching(false);
   };

   function handleOptionClick(isCorrectOption) {
      console.log(
         'AN OPTION BUTTON CLICKED:', 
         isCorrectOption ? "CORRECT" : "INCORRECT"
      );
      setIsNextQnBtnDisabled(false);
      setIsExplBtnDisabled(false);
      setIsCorrect(isCorrectOption);
   };

   function handleNextQnBtnClick() {
      console.log('NEXT QN BUTTON CLICKED');
      setNumQnsAns((prevNum) => prevNum + 1);
      isCorrect
         ? setNumCorrectAns((prevNum) => prevNum + 1)
         : setWrongAnsArr((prevArr) => [...prevArr, pick(qnObj, [
            'sentence', 'wordToTest', 'rootWord', 'def'
         ])]);
      // before we update isCorrect back to null, increment numCorrectAns if it is true, if not add some of the values in qnObj to wrongQnsArr

      setIsNextQnBtnDisabled(true);
      setIsExplBtnDisabled(true);
      setIsCorrect(null);
      // reset states
      
      if (qnIdx === qnOrderArr.length - 1) {
         setQnIdx(0);
      } else {
         setQnIdx(prev => prev + 1);
      };
      // get next question
   }

   return (
      <GEPQnContext.Provider
         value={{
            qnObj,
            handleOptionClick,
            isCorrect,
            isExplBtnDisabled,
            isNextQnBtnDisabled,
            handleNextQnBtnClick,
            numQnsAns,
            numCorrectAns,
            wrongAnsArr,
         }}
      >
         {isFetching ? <LoadingSpinner /> : children}
      </GEPQnContext.Provider>
   );
};