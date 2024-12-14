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
      qnNum,
      userClozeData: { hasDoneCloze, correctAns },
      isLoading,
      handleReset
   } = QnContextToUse();

   useEffect(() => {
      if (isLoading) return;
   }, [isLoading])

   if (!hasDoneCloze || isLoading) return null;

   const garbage: (string | React.JSX.Element)[][] = (() => {
      const paragraphsWithInput = textArr.reduce<(string | React.JSX.Element)[]>(
         (acc, part, idx) => {
   
            const splitPart = part.split(/(\|\|)/);
   
            if (idx === textArr.length - 1) {
               return [...acc, ...splitPart];
            }

            return [
               ...acc,
               ...splitPart,
               <span 
                  key={idx} 
                  className="d-inline-block fw-bold"
               >
                  ({idx + 1})&nbsp;
                  <span
                     className={"text-decoration-underline" +
                     (correctAns.includes(idx) ? " text-success" : " text-danger")}
                  >
                     {wordsToTestArr[idx].join("/")}
                  </span>
               </span>
            ];

         }, []
      );
   
      let formattedParagraphs: (string | React.JSX.Element)[][] = [];
      let currentArray: (string | React.JSX.Element)[] = [];
      for (let item of paragraphsWithInput) {
         if (item === "||") {
            formattedParagraphs.push(currentArray);
            currentArray = [];
         } else {
            currentArray.push(item);
         }
      }
      
      formattedParagraphs.push(currentArray);

      return formattedParagraphs;
   })();

   return (
      <>
         <Alert variant="info" >
            You already attempted this cloze.<br/>Your score:&nbsp;
            
            <strong>{correctAns.length} / 15</strong>

            <Button
               size="sm"
               variant="info" 
               className="ms-auto d-flex align-items-center"
               onClick={async () => await handleReset()}
            >
               <RotateCcw size={18} strokeWidth={2}/>&nbsp;Reset
            </Button>
         </Alert>

         <article 
            style={{lineHeight: "40px", fontSize: "17px", textAlign: "justify"}}
         >
            <header><strong><u>Cloze #{qnNum}</u></strong></header>
            {garbage.map((paraArr, idx) => 
               <p key={idx}>{paraArr}</p>)
            }
         </article>
      </>
   );
}