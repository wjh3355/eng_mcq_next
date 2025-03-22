"use client";

import React from "react";
import ClozeInput from "./ClozeInput";
import { useClozeContext } from "./ClozeProvider";
import Button from "react-bootstrap/esm/Button";

export default function ClozeAttemptUI() {

   const {
      clozePassageArray,
      clozeState,
      clozeTitle,
      isClozeSubmitted,
      handleBlankUpdate,
      handleResetAllBlanks,
   } = useClozeContext();

   // get the paragraph to render
   const paragraphToRender: React.ReactNode[][] = (() => {

      // 0 to 14 (all 15 blanks)
      let blankCountr = 0;

      // counter for the other text parts
      let textCountr = 0;

      let formattedParagraphs: React.ReactNode[][] = [];
      let currParagraph: React.ReactNode[] = [];

      for (let fragment of clozePassageArray) {

         // if the fragment is "||", push the current array 
         // to the formattedParagraphs array (denotes a new paragraph)
         // new paragraph: current array is an empty array
         if (fragment === "||") {

            formattedParagraphs.push(currParagraph);
            currParagraph = [];

         // if the fragment is "BLANK", add an input field to current array
         // increment the blankCountr
         } else if (fragment === "BLANK") {

            const { blankIdx, answer, status, blankCorrectAns } = clozeState[blankCountr];

            // determine the style of the input field
            // default: not submitted yet, or submitted but was blank
            // red: incorrect answer
            // green: correct answer
            let style: 'red' | 'green' | 'default' = 'default';
            if (status === 'correct') {
               style = 'green';
            } else if (status === 'incorrect') {
               style = 'red';
            }

            currParagraph.push(
               <span key={`blank-${blankCountr}`} className="d-inline-block">
                  <strong>Q{blankIdx+1}.</strong>&nbsp;
                  <span className="d-inline-flex align-items-center position-relative">
                     <ClozeInput
                        type="text"
                        autoComplete="off"
                        disabled={isClozeSubmitted || status === 'correct'}
                        $style={style}
                        autoFocus={blankCountr === 0}
                        name={blankCountr.toString()}
                        value={answer}
                        onChange={e => handleBlankUpdate(blankIdx, e.target.value)}
                     />

                     {isClozeSubmitted && 
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
                           {blankCorrectAns.join(" / ")}
                        </small>
                     }

                  </span>
               </span>
            );

            blankCountr++;

         } else {

            currParagraph.push(
               <span key={`text-${textCountr++}`}>
                  {fragment}
               </span>
            );
            
         }
      }
      
      formattedParagraphs.push(currParagraph);

      return formattedParagraphs;

   })();

   return (
      <section 
         style={{
            lineHeight: "40px",
            textAlign: "justify",
            fontSize: "17px",
            ...(isClozeSubmitted && { lineHeight: "70px" })
         }}
      >
         <header className="fw-bold text-decoration-underline">{clozeTitle}</header>
         {paragraphToRender.map((paraArr, idx) => 
            <p key={idx} className={idx !== paragraphToRender.length - 1 ? "mb-5" : ""}>{paraArr}</p>)
         }

         {!isClozeSubmitted &&
            <div className="d-flex">
               <Button
                  variant="outline-primary"
                  className="mx-auto"
                  onClick={() => handleResetAllBlanks()}
               >
                  Reset Blanks
               </Button>
            </div>
         }
      </section>
   )
}

// {/* <div className="mx-auto bg-warning px-4 border-0 rounded-2 py-2">
//    Score: <strong>{score} / 15</strong>
// </div>

// <div className="hstack gap-2 d-flex justify-content-center">
//    <Button 
//       type="submit"
//       variant="danger"
//       disabled={hasAttempted || isLoading || isSubmitBtnCooldown}
//       className="fw-bold px-4"
//    >
//       {`Submit: ${numTriesLeft} attempt(s) left`}
//    </Button>

//    <Button 
//       onClick={() => handleReset()}
//       variant="secondary"
//       disabled={hasAttempted || isLoading}
//       className="fw-bold px-4"
//    >
//       Reset
//    </Button>
// </div> */}