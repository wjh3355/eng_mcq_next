"use client";

import Col from "react-bootstrap/esm/Col";
import styled from "styled-components";
import { useMockTestContext } from "./MTProvider";
import Button from "react-bootstrap/esm/Button";
import { RotateCcw } from "lucide-react";

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

   // cloze is the last page
   if (currUserPage !== totalNumOfPages) return null;

   // get only the cloze states
   const clozeTestStates = testStates.filter(ts => ts.type === "cloze blank");

   // get the paragraph to render
   const paragraphToRender: (string | React.JSX.Element)[][] = (() => {

      // 0 to 14 (all 15 blanks)
      let blankCountr = 0;

      let formattedParagraphs: (string | React.JSX.Element)[][] = [];
      let currArray: (string | React.JSX.Element)[] = [];

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

            const { qnIndex, answer, status } = clozeTestStates[blankCountr];

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
               <label key={blankCountr}>
                  <strong>Q{qnIndex+1}.</strong>&nbsp;
                  <MTClozeInput
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
               </label>
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
      <Col xs={12}>
         <section className="border-0 shadow rounded-4 p-3">
            <article style={{lineHeight: "40px", textAlign: "justify"}}>
               {paragraphToRender.map((paraArr, idx) => 
                  <p key={idx} className="mb-5">{paraArr}</p>)
               }
            </article>
            <div className="d-flex justify-content-center">
               {isMTSubmitted
                  ?  <small className="border border-3 rounded-4 p-2">
                        Cloze Score: {clozeTestStates.filter(cs => cs.status === "correct").length} / 15
                     </small>
                  :  <Button 
                        onClick={handleResetAllCloze}
                        className="d-flex align-items-center"
                     >
                        <RotateCcw size={20}/>&nbsp;Reset Blanks
                     </Button>
               }
            </div>
         </section>
      </Col>
   );
}

const MTClozeInput = styled.input<{
   $style: "red" | "green" | "default";
}>`
   width: 130px;
   height: 32px;
   text-align: center;
   border: 2px solid lightgray;
   border-radius: 5px;
   background-color: white;
   &:disabled {
      ${({$style}) => $style === "green" && "color: green; font-weight: bold; border-color: green;"}
      ${({$style}) => $style === "red" && "color: rgb(190, 44, 44); font-weight: bold; border-color: rgb(190, 44, 44);"}
   }
`;