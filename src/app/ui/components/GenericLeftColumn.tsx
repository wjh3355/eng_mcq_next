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
      showWrongQnsAgain,
      areBtnsDisabled,
      score: [numCorrect, numTotal],
      wrongAnsArr,
      qnObj: { sentence, wordToTest, rootWord, type, def },
      isLoading
   } = QnContextToUse();

   const [isExplShown, setIsExplShown] = useState(false);
   const [isReviewShown, setIsReviewShown] = useState(false);

   useEffect(() => {
      if (areBtnsDisabled) setIsExplShown(false);
   }, [areBtnsDisabled]);

   const percentCorrect = numTotal === 0
      ? 0
      : Math.round((numCorrect * 100) / numTotal);

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
                  disabled={areBtnsDisabled}
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
                  onClick={async () => await handleNextQnBtnClick()}
                  disabled={areBtnsDisabled}
               >
                  Next Question
               </Button>
            </ButtonGroup>
         </div>

         <Collapse in={isExplShown}>
            <div>
               {areBtnsDisabled 
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
                     {numCorrect} / {numTotal}
                  </strong>
                  &nbsp; ({percentCorrect}% correct)
               </Modal.Title>
            </Modal.Header>

            <Modal.Body>

               <GenericReview wrongAnsArr={wrongAnsArr} />

               <div className="d-flex justify-content-center mt-3">
                  <Button
                     disabled={wrongAnsArr.length === 0}
                     onClick={() => {
                        setIsReviewShown(!isReviewShown);
                        showWrongQnsAgain();
                     }}
                     variant="secondary"
                     className=""
                  >
                     Redo Incorrect Questions
                  </Button>
               </div>

            </Modal.Body>
         </Modal>
      </Col>
   );
};