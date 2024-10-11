'use client';

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Collapse from "react-bootstrap/Collapse";
import Modal from "react-bootstrap/Modal";

import { useState, useEffect } from "react";

import GenericReview from "./GenericReview";
import QnSentenceFormatter from "./QnSentenceFormatter";

import { GenericMCQContextValueType } from "@/lib/data";
import Skeleton from "react-loading-skeleton";

export default function GenericLeftColumn({
   QnContextToUse,
}: {
   QnContextToUse: () => GenericMCQContextValueType;
}) {

   const {
      handleNextQnBtnClick,
      isNextQnBtnDisabled,
      isExplBtnDisabled,
      numQnsAns,
      numCorrectAns,
      wrongAnsArr,
      qnObj: { sentence, wordToTest, rootWord, type, def },
      isLoading
   } = QnContextToUse();

   const [isExplShown, setIsExplShown] = useState(false);
   const [isReviewShown, setIsReviewShown] = useState(false);

   useEffect(() => {
      if (isExplBtnDisabled) setIsExplShown(false);
   }, [isExplBtnDisabled]);

   const percentCorrect = numQnsAns
      ? Math.round((numCorrectAns * 100) / numQnsAns)
      : 0;

   return (
      <Col lg={8} md={7}>
         <Card body className="mb-3">
            {isLoading ? (
               <Skeleton height="24px" />
            ) : (
               <QnSentenceFormatter
                  sentence={sentence}
                  wordToTest={wordToTest}
               />
            )}
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
               {isExplBtnDisabled 
                  ? null 
                  : (
                     <Card body>
                        <p>
                           <strong className="me-2 fs-5">{rootWord}</strong>
                           <i className="text-secondary">{type}</i>
                        </p>
                        {def}.
                     </Card>
                  )
               }
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