"use client";

import { ClozeContextValue } from "@/types"
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";

export default function GenericClozeCompleted({ QnContextToUse }: { QnContextToUse: () => ClozeContextValue }) {

   const {
      clozeObj: { passage, qnNum },
      clozeData: { hasDoneCloze, score },
      isLoading
   } = QnContextToUse();

   const [paragraphToRender, setParagraphToRender] = useState<(string | React.JSX.Element)[][]>([]);

   useEffect(() => {
      if (isLoading) return;

      const textArr = passage.split(/\{[^}]*\}/g);

      const wordsToTestArr: string[][] = passage
         .match(/\{[^}]*\}/g)!
         .map((match) => 
            [...match.slice(1, -1).split("/").filter((word) => word !== "")]);
   
      const junk: (string | React.JSX.Element)[][] = (() => {
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
                     className="text-success d-inline-block fw-bold text-decoration-underline"
                  >
                     {wordsToTestArr[idx].join("/")}
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
         if (currentArray.length > 0) formattedParagraphs.push(currentArray);
   
         return formattedParagraphs;
      })();

      setParagraphToRender(junk);
      console.log("AAAAAAAAAAAAAAAAAA")
   }, [passage, isLoading])

   if (!hasDoneCloze || isLoading) return null;

   return (
      <>
         <Alert variant="info" className="d-flex align-items-center">
            You already completed this cloze! Your score:&nbsp;<strong>{score} / 15</strong>
         </Alert>

         <article 
            style={{lineHeight: "40px", fontSize: "17px", textAlign: "justify"}}
         >
            <header><strong><u>Cloze #{qnNum}</u></strong></header>
            {paragraphToRender.map((paraArr, idx) => 
               <p key={idx}>{paraArr}</p>)
            }
         </article>
      </>
   );
}