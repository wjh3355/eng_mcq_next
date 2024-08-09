'use client';

import { Button, Card, Col, Collapse, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

import Review from "./Review";

import { useGEPQnContext } from "../utils/GEPQnProvider";

export default function LeftColumn() {

   const { 
      handleNextQnBtnClick, 
      isNextQnBtnDisabled, 
      isExplBtnDisabled,
      numQnsAns,
      numCorrectAns
   } = useGEPQnContext();

   const [isExplShown, setIsExplShown] = useState(false);
   const [isReviewShown, setIsReviewShown] = useState(false);

   useEffect(() => {
      isExplBtnDisabled && setIsExplShown(false);
   }, [isExplBtnDisabled])

   let percentCorrect = numQnsAns
      ? Math.round((numCorrectAns * 100) / numQnsAns)
      : 0;

   return (
      <Col lg={8}>
         <Card body className="mb-3">
            <Question />
         </Card>

         <div className="d-flex gap-3 mb-2">
            <Button
               variant="primary"
               style={{ flex: 1 }}
               disabled={isExplBtnDisabled}
               onClick={() => setIsExplShown(!isExplShown)}
               aria-controls="collapse-text"
               aria-expanded={isExplShown}
            >
               {isExplShown ? "Hide Explanation" : "Show Explanation"}
            </Button>

            <Button
               variant="outline-secondary"
               style={{ flex: 1 }}
               onClick={() => setIsReviewShown(!isReviewShown)}
            >
               Score & Review
            </Button>

            <Button
               variant="success"
               style={{ flex: 1 }}
               onClick={handleNextQnBtnClick}
               disabled={isNextQnBtnDisabled}
            >
               Next Question
            </Button>
         </div>

         <Collapse in={isExplShown}>
            <div>
               {!isExplBtnDisabled && <Explanation />}
            </div>
         </Collapse>

         <Modal
            show={isReviewShown}
            onHide={() => setIsReviewShown(!isReviewShown)}
            size="lg"
            centered
         >
            <Modal.Header closeButton>
               <Modal.Title>
                  Current score:
                  &nbsp;
                     {numCorrectAns} / {numQnsAns} ({percentCorrect}%)
               </Modal.Title>
            </Modal.Header>

            <Modal.Body>

               <Review />

            </Modal.Body>
         </Modal>
      </Col>
   );
};

function Explanation() {
   const { qnObj: { rootWord, type, def } } = useGEPQnContext();
   
   return (
      <Card body>
         <p>
            <strong className="fs-5 me-1">
               {rootWord}&nbsp;
            </strong>
            <span className="fst-italic">({type})</span>
         </p>
         {def}.
      </Card>
   );
};

function Question() {
   const { qnObj: { sentence, wordToTest } } = useGEPQnContext();

   const idxOfWord = sentence.indexOf(wordToTest);

   return (
      <div className="fs-5">
        {sentence.slice(0, idxOfWord)}
        <strong>{wordToTest}</strong>
        {sentence.slice(idxOfWord + wordToTest.length)}
      </div>
   );
};