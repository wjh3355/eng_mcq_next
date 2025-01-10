"use client";

import { ClozeContextValue } from "@/types"
import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

export default function GenericClozeCompleted({ QnContextToUse }: { QnContextToUse: () => ClozeContextValue }) {

   const {
      wordsToTestArr,
      textArr,
      passageTitle,
      prevUserCorrectAns,
      isLoading,
      handleReset,
      isDemo
   } = QnContextToUse();

   useEffect(() => {
      if (isLoading) return;
   }, [isLoading])

   if (prevUserCorrectAns === null || isLoading || isDemo) return null;

   const garbage: (string | React.JSX.Element)[][] = (() => {

      let blankCountr = 0;

      let formattedParagraphs: (string | React.JSX.Element)[][] = [];
      let currArray: (string | React.JSX.Element)[] = [];

      for (let fragment of textArr) {

         if (fragment === "||") {

            formattedParagraphs.push(currArray);
            currArray = [];

         } else if (fragment === "BLANK") {

            currArray.push(
               <span 
               key={blankCountr} 
               className="d-inline-block fw-bold"
               >
                  ({blankCountr + 1})&nbsp;
                  <span
                     className={"text-decoration-underline" +
                     (prevUserCorrectAns.includes(blankCountr) ? " text-success" : " text-danger")}
                  >
                     {wordsToTestArr[blankCountr].join("/")}
                  </span>
               </span>
            );

            blankCountr++;

         } else {

            currArray.push(fragment);
            
         }
      }
      
      formattedParagraphs.push(currArray);

      return formattedParagraphs;

   })();

   return (
      <>
         <Alert variant="info" >
            You already attempted this cloze.<br/>Your score:&nbsp;
            
            <strong>{prevUserCorrectAns.length} / 15</strong>

            <Button
               size="sm"
               variant="info" 
               className="ms-auto d-flex align-items-center"
               onClick={async () => await handleReset()}
            >
               <RotateCcw size={18} strokeWidth={2}/>&nbsp;Reset
            </Button>
         </Alert>

         <article style={{lineHeight: "40px", fontSize: "17px", textAlign: "justify"}}>
            <header className="fw-bold text-decoration-underline">{passageTitle}</header>
            {garbage.map((paraArr, idx) => 
               <p key={idx}>{paraArr}</p>)
            }
         </article>
      </>
   );
}