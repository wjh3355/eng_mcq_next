'use client';

import { createContext, useState, useEffect, useContext } from "react";
import { fetchQnJson } from "./data";
import { pick, shuffle, range } from "lodash";

import LoadingSpinner from "../ui/LoadingSpinner";

const GEPQnContext = createContext();

export const useGEPQnContext = () => useContext(GEPQnContext);

export function GEPQnProvider({ children, rangeOfQns }) {
   const [qnOrder, setQnOrder] = useState([]);
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
      switch (rangeOfQns) {
         case "set1":
            setQnOrder(shuffle(range(1, 101)));
            console.log("SET 1 CHOSEN");
            break;
         case "set2":
            setQnOrder(shuffle(range(101, 201)));
            console.log("SET 2 CHOSEN");
            break;
         case "set3":
            setQnOrder(shuffle(range(201, 301)));
            console.log("SET 3 CHOSEN");
            break;
         case "set4":
            setQnOrder(shuffle(range(301, 401)));
            console.log("SET 4 CHOSEN");
            break;
         case "set5":
            setQnOrder(shuffle(range(401, 501)));
            console.log("SET 5 CHOSEN");
            break;
         case "set6":
            setQnOrder(shuffle(range(501, 601)));
            console.log("SET 6 CHOSEN");
            break;
         case "complete":
            setQnOrder(shuffle(range(1, 601)));
            console.log("ALL QNS CHOSEN");
            break;
         default:
            alert("Invalid Link!");
            break;
      }
   }, []);

   useEffect(() => {
      qnOrder.length !== 0 && fetchNewQnObj();
   }, [qnOrder, qnIdx]);
      
   async function fetchNewQnObj() {
      setIsFetching(true);
      setQnObj(null);

      await new Promise(resolve => setTimeout(resolve, 500));
      // Fake delay
      const data = await fetchQnJson(qnOrder[qnIdx]);
      console.log('NOW DISPLAYING QUESTION', qnOrder[qnIdx]);

      setQnObj(data);
      setIsFetching(false);
   };

   function handleOptionClick(isCorrectOption) {
      console.log('AN OPTION BUTTON CLICKED:', isCorrectOption ? "CORRECT" : "WRONG");
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
      
      if (qnIdx === qnOrder.length - 1) {
         setQnIdx(0);
      } else {
         setQnIdx(prev => prev + 1);
      };
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