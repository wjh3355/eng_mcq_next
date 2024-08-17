'use client';

import {
   Button,
   ButtonGroup,
   Card,
   Col,
   Collapse,
   Modal,
} from "react-bootstrap";
import { useEffect, useState } from "react";

import Review from "./Review";

import { useGEP_VOCAB_QnContext } from "../provider/GEP_VOCAB_QnProvider";

import { QnObjType } from "@/lib/types";

export default function LeftColumn() {

   const { 
      handleNextQnBtnClick, 
      isNextQnBtnDisabled, 
      isExplBtnDisabled,
      numQnsAns,
      numCorrectAns
   } = useGEP_VOCAB_QnContext();

   const [isExplShown, setIsExplShown] = useState(false);
   const [isReviewShown, setIsReviewShown] = useState(false);

   useEffect(() => {
      isExplBtnDisabled && setIsExplShown(false);
   }, [isExplBtnDisabled])

   let percentCorrect = numQnsAns
      ? Math.round((numCorrectAns * 100) / numQnsAns)
      : 0;

   return (
      <Col lg={8} md={7}>
         <Card body className="mb-3">
            <SentenceToBeDisplayed />
         </Card>

         <div className="mb-2">
            <ButtonGroup className="w-100">
               <Button
                  variant="primary"
                  className="flex-fill"
                  style={{ flex: 1 }}
                  onClick={() => setIsReviewShown(!isReviewShown)}
               >
                  Score & Review
               </Button>

               <Button
                  variant="secondary"
                  className="flex-fill"
                  style={{ flex: 1 }}
                  disabled={isExplBtnDisabled}
                  onClick={() => setIsExplShown(!isExplShown)}
                  aria-controls="collapse-text"
                  aria-expanded={isExplShown}
               >
                  Explanation
               </Button>


               <Button
                  variant="success"
                  className="flex-fill"
                  style={{ flex: 1 }}
                  onClick={handleNextQnBtnClick}
                  disabled={isNextQnBtnDisabled}
               >
                  Next Question
               </Button>
            </ButtonGroup>
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
                  <strong
                     className={percentCorrect >= 50 ? 'text-success' : 'text-danger'}
                  >
                     {numCorrectAns} / {numQnsAns}
                  </strong>
                  &nbsp;
                  ({percentCorrect}% correct)
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
   const { qnObj } = useGEP_VOCAB_QnContext() as { qnObj: QnObjType };
   const { rootWord, type, def } = qnObj;
   
   return (
      <Card body>
         <p>
            <strong className="fs-5 me-1">
               {rootWord}&nbsp;
            </strong>
            <span className="fs-5">({type})</span>
         </p>
         {def}.
      </Card>
   );
};

function SentenceToBeDisplayed() {
   const { qnObj } = useGEP_VOCAB_QnContext() as { qnObj: QnObjType };
   const { sentence, wordToTest } = qnObj;

   const idxOfWord = sentence.indexOf(wordToTest);

   return (
      <div className="fs-5">
        {sentence.slice(0, idxOfWord)}
        <strong>{wordToTest}</strong>
        {sentence.slice(idxOfWord + wordToTest.length)}
      </div>
   );
};