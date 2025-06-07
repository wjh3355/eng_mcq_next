"use client";

import React, { memo, useState } from "react";
import { useMockTestContext } from "./MTProvider";
import Button from "react-bootstrap/esm/Button";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import Collapse from "react-bootstrap/esm/Collapse";
import Modal from "react-bootstrap/esm/Modal";
import { MTState } from "@/definitions";

const PageNums = memo(function PageNums({
   totalNumOfPages,
   testStates,
   handlePaginationClick,
   currUserPage,
}: {
   totalNumOfPages: number,
   testStates: MTState[],
   handlePaginationClick: (_: number) => void,
   currUserPage: number
}) {

   const pageNumbers: React.ReactNode[] = [];
   for (let thisPage = 1; thisPage <= totalNumOfPages; thisPage++) {

      if (thisPage !== totalNumOfPages) {
         // for questions

         let bgColour = '';
         switch (testStates[thisPage-1].status) {
            case "not done":
               bgColour = 'lightgray';
               break;
            case "done":
               bgColour = 'lightblue';
               break;
            case "correct":
               bgColour = 'lightgreen';
               break;
            case "incorrect":
               bgColour = 'orangered';
               break;
         }

         pageNumbers.push(
            <button
               key={thisPage}
               style={{ width: "28px", height: "28px", backgroundColor: bgColour, fontSize: "12px"}}
               onClick={() => handlePaginationClick(thisPage)}
               className={'' + (currUserPage === thisPage ? 'fw-bold text-decoration-underline' : '')}
            >
               {thisPage}
            </button>
         );
      } else {
         // for cloze

         const clozeTestStates = testStates.filter(ts => ts.type === "cloze blank");

         // if none attempted: lightgray
         // if at least one attempted: lightblue
         // if all correct: lightgreen
         // if some correct: yellow
         // if none correct: orangered
         let bgColour = '';
         if (clozeTestStates.some(thisClozeState => thisClozeState.status === "not done")) {
            bgColour = 'lightgray';
         } else if (clozeTestStates.some(thisClozeState => thisClozeState.status === "done")) {
            bgColour = 'lightblue';
         } else if (clozeTestStates.every(thisClozeState => thisClozeState.status === "correct")) {
            bgColour = 'lightgreen';
         } else if (clozeTestStates.some(thisClozeState => thisClozeState.status === "correct")){
            bgColour = 'yellow';
         } else {
            bgColour = 'orangered';
         }

         pageNumbers.push(
            <button
               key={thisPage}
               style={{ height: "28px", backgroundColor: bgColour, fontSize: "12px" }}
               onClick={() => handlePaginationClick(thisPage)}
               className={'' + (currUserPage === thisPage ? 'fw-bold text-decoration-underline' : '')}
            >
               Cloze
            </button>
         );
      }

   }
   return pageNumbers;
});

export default function MTPagination() {

   const {
      totalNumOfPages,
      testStates,
      maximumMTScore,
      handleNextPgClick,
      handlePrevPgClick,
      handlePaginationClick,
      resetMockTest,
      currUserPage,
      submitMockTest,
      isMTSubmitted,
      finalMTScore
   } = useMockTestContext();

   const [isPgNumsShow, setIsPgNumsShow] = useState<boolean>(false);
   const [isCfmSubmitShow, setIsCfmSubmitShow] = useState<boolean>(false);

   return (
      <>
         <div className="d-flex flex-row justify-content-center justify-content-md-end gap-3 mb-3">
            <Button
               variant="outline-secondary"
               onClick={handlePrevPgClick}
               className="d-flex align-items-center"
               disabled={currUserPage === 1}
            >
               <ArrowLeftCircle size={20}/>&nbsp;Prev
            </Button>
            <Button
               variant="secondary"
               onClick={() => setIsPgNumsShow(!isPgNumsShow)}
            >  
               Pages
            </Button>
            <Button
               variant="outline-secondary"
               onClick={handleNextPgClick}
               className="d-flex align-items-center"
               disabled={currUserPage === totalNumOfPages}
            >
               Next&nbsp;<ArrowRightCircle size={20}/>
            </Button>
         </div>

         <Collapse in={isPgNumsShow}>
            <div>
               <div className="d-flex flex-row flex-wrap justify-content-center mb-3">
                  <PageNums
                     totalNumOfPages={totalNumOfPages}
                     testStates={testStates}
                     handlePaginationClick={handlePaginationClick}
                     currUserPage={currUserPage}
                  />
               </div>
            </div>
         </Collapse>

         <div className="mt-3 d-flex flex-column">
         {
            isMTSubmitted 
            ?  <>
                  <p className="fs-5 border border-4 rounded-4 p-3 border-warning fw-bold mx-auto">
                     Final Score: {finalMTScore} / {maximumMTScore}
                  </p>
                  <Button
                     variant="warning"
                     className="mx-auto"
                     size="sm"
                     onClick={() => resetMockTest()}
                  >
                  Reset Mock Test
                  </Button>
               </>
            :  <Button
                  variant="danger"
                  size="lg"
                  className="mx-auto px-5 fw-bold"
                  onClick={() => setIsCfmSubmitShow(true)}
               >
                  Submit
               </Button>
         }
         </div>

         <Modal size="lg" centered show={isCfmSubmitShow} onHide={() => setIsCfmSubmitShow(false)} backdrop="static">
            <Modal.Header><Modal.Title className="fs-5">Submit Mock Test</Modal.Title></Modal.Header>
            <Modal.Body>
               <p className="text-center mb-3">Are you sure you want to submit the mock test?</p>

               <div className="d-flex justify-content-center gap-3">
                  <Button 
                     variant="danger"
                     onClick={() => setIsCfmSubmitShow(false)}
                  >
                     Cancel
                  </Button>
                  <Button 
                     variant="light"
                     onClick={() => {
                        setIsCfmSubmitShow(false);
                        submitMockTest(testStates);
                     }}
                  >
                     Submit
                  </Button>
               </div>
            </Modal.Body>
         </Modal>

      </>
   )
}
