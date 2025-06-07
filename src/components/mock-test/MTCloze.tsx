"use client";

import React, { useMemo } from 'react';
import Col from "react-bootstrap/esm/Col";
import { useMockTestContext } from "./MTProvider";
import Button from "react-bootstrap/esm/Button";
import { RotateCcw } from "lucide-react";
import ClozeInput from "../cloze/ClozeInput";

export default function MTCloze() {

   const {
      clozePassageArray,
      testStates,
      isMTSubmitted,
      handleReset,
      handleResetAllCloze,
      handleTouched,
      currUserPage,
      totalNumOfPages
   } = useMockTestContext();

   // get only the cloze states
   const clozeTestStates = useMemo(() => testStates.filter(ts => ts.type === "cloze blank"), [testStates]);

   // get the paragraph to render
   const paragraphToRender: React.ReactNode[][] = useMemo(() => {

      // 0 to 14 (all 15 blanks)
      let blankCountr = 0;

      // counter for the other text parts
      let textCountr = 0;

      let formattedParagraphs: React.ReactNode[][] = [];
      let currArray: React.ReactNode[] = [];

      for (let fragment of clozePassageArray) {

         // if the fragment is "||", push the current array 
         // to the formattedParagraphs array (denotes a new paragraph)
         // new paragraph: current array is an empty array
         if (fragment === "||") {

            formattedParagraphs.push(currArray);
            currArray = [];

         // if the fragment is "BLANK", add an input field to current array
         // increment the blankCountr
         } else if (fragment === "BLANK") {

            const { qnIndex, answer, status, clozeBlankCorrectAns } = clozeTestStates[blankCountr];

            // determine the style of the input field
            // default: not submitted yet, or submitted but was blank
            // red: incorrect answer
            // green: correct answer
            let style: 'red' | 'green' | 'default' = 'default';
            if (!isMTSubmitted || status === 'incorrect' && !answer) {
               style = 'default';
            } else if (status === 'correct') {
               style = 'green';
            } else if (status === 'incorrect') {
               style = 'red';
            }

            currArray.push(
               <span key={`blank-${blankCountr}`} className="d-inline-block">
                  <strong>Q{qnIndex+1}.</strong>&nbsp;
                  <span className="d-inline-flex align-items-center position-relative">
                     <ClozeInput
                        type="text"
                        autoComplete="off"
                        disabled={isMTSubmitted}
                        $style={style}
                        autoFocus={blankCountr === 0}
                        name={blankCountr.toString()}
                        value={answer}
                        onChange={(e) => {
                           if (e.target.value) {
                              handleTouched(qnIndex, e.target.value);
                           } else {
                              handleReset(qnIndex);
                           }
                        }}
                     />

                     {isMTSubmitted && 
                        <small 
                           className="position-absolute text-muted fst-italic" 
                           style={{ 
                              top: "36px",
                              left: 0,
                              right: 0,
                              whiteSpace: "nowrap",
                              lineHeight: "1",
                              textAlign: "center"
                           }}
                        >
                           {clozeBlankCorrectAns.join(" / ")}
                        </small>
                     }

                  </span>
               </span>
            );

            blankCountr++;

         } else {

            currArray.push(
               <span key={`text-${textCountr++}`}>
                  {fragment}
               </span>
            );
            
         }
      }
      
      formattedParagraphs.push(currArray);

      return formattedParagraphs;

   }, [clozePassageArray, clozeTestStates, handleReset, handleTouched, isMTSubmitted]);

   // cloze is the last page
   if (currUserPage !== totalNumOfPages) return null;

   return (
      <Col xs={12}>
         <section className="border-0 shadow rounded-4 p-3">
            <article 
               style={{
                  lineHeight: "40px",
                  textAlign: "justify",
                  ...(isMTSubmitted && { lineHeight: "70px" })
               }}
            >
               {paragraphToRender.map((paraArr, idx) => 
                  <p key={idx} className={idx !== paragraphToRender.length - 1 ? "mb-5" : ""}>{paraArr}</p>)
               }
            </article>
            <div className="d-flex justify-content-center flex-column">
               {isMTSubmitted
                  ?  <small className="border border-3 rounded-4 p-2 mx-auto">
                        Cloze Score: {clozeTestStates.filter(cs => cs.status === "correct").length} / 15
                     </small>
                  :  <Button 
                        onClick={handleResetAllCloze}
                        className="d-flex align-items-center mx-auto"
                     >
                        <RotateCcw size={20}/>&nbsp;Reset Blanks
                     </Button>
               }
            </div>
         </section>
      </Col>
   );
}