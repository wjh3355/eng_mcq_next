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

import GenericReview from "./GenericReview";
import SentenceFormatter from "./SentenceFormatter";

import { GenericMCQContextValueType } from "@/lib/types";

export default function GenericLeftColumn({
   QnContextToUse
}: {
   QnContextToUse: () => GenericMCQContextValueType
}) {

   const { 
      handleNextQnBtnClick, 
      isNextQnBtnDisabled, 
      isExplBtnDisabled,
      numQnsAns,
      numCorrectAns,
      qnObj,
      wrongAnsArr
   } = QnContextToUse();

   const [isExplShown, setIsExplShown] = useState(false);
   const [isReviewShown, setIsReviewShown] = useState(false);

   useEffect(() => {
      if (isExplBtnDisabled) setIsExplShown(false);
   }, [isExplBtnDisabled]);


   if (!qnObj) return null;
   const { sentence, wordToTest, rootWord, type, def } = qnObj;


   let percentCorrect = numQnsAns
      ? Math.round((numCorrectAns * 100) / numQnsAns)
      : 0;

   return (
      <Col lg={8} md={7}>
         <Card body className="mb-3">
            <SentenceFormatter
               fontSize="18px"
               sentence={sentence}
               wordToTest={wordToTest}
            />
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
               {!isExplBtnDisabled && (
                  <Card body>
                     <p className="fs-5">
                        <strong className="me-2">{rootWord}</strong>
                        <span>({type})</span>
                     </p>
                     {def}.
                  </Card>
               )}
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
                  Current score: &nbsp;
                  <strong
                     className={
                        percentCorrect >= 50 ? "text-success" : "text-danger"
                     }
                  >
                     {numCorrectAns} / {numQnsAns}
                  </strong>
                  &nbsp; ({percentCorrect}% correct)
               </Modal.Title>
            </Modal.Header>

            <Modal.Body>
               <GenericReview wrongAnsArr={wrongAnsArr} />
            </Modal.Body>
         </Modal>
      </Col>
   );
};