'use client';

import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Collapse from "react-bootstrap/Collapse";
import Modal from "react-bootstrap/Modal";

import DictionaryEntry from "./DictionaryEntry";
import QnSentenceFormatter from "./QnSentenceFormatter";

import { MCQContextValue } from '@/types';
import Skeleton from "react-loading-skeleton";
import { RotateCcw } from "lucide-react";

export default function GenericLeftColumn({ QnContextToUse }: { QnContextToUse: () => MCQContextValue }) {

   const {
      handleNextQnBtnClick,
      showWrongQnsAgain,
      areBtnsDisabled,
      score: [numCorrect, numTotal],
      wrongAnsArr,
      qnObj,
      isLoading
   } = QnContextToUse();

   const {sentence, wordToTest} = qnObj;

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
            {isLoading 
               ?  <Skeleton height="24px" />
               :  <QnSentenceFormatter
                     sentence={sentence}
                     wordToTest={wordToTest}
                  />
            }
         </Card>

         <ButtonGroup className="w-100 mb-3">
            <Button variant="primary" className="flex-fill" style={{ flex: 1 }}
               onClick={() => setIsReviewShown(!isReviewShown)}
            >
               Score & Review
            </Button>

            <Button variant="secondary" className="flex-fill" style={{ flex: 1 }}
               disabled={areBtnsDisabled}
               onClick={() => setIsExplShown(!isExplShown)}
            >
               Explanation
            </Button>

            <Button variant="success" className="flex-fill" style={{ flex: 1 }}
               disabled={areBtnsDisabled}
               onClick={async () => await handleNextQnBtnClick()}
            >
               Next Question
            </Button>
         </ButtonGroup>

         <Collapse in={isExplShown}>
            <div>{!areBtnsDisabled && <DictionaryEntry qnObj={qnObj} />}</div>
         </Collapse>

         <Modal size="lg" centered
            show={isReviewShown}
            onHide={() => setIsReviewShown(!isReviewShown)}
         >
            <Modal.Header closeButton>
               <Modal.Title>
                  Current score: &nbsp;
                  <strong className={percentCorrect >= 50 ? "text-success" : "text-danger"}>
                     {numCorrect} / {numTotal}
                  </strong>
                  &nbsp; ({percentCorrect}% correct)
               </Modal.Title>
            </Modal.Header>

            <Modal.Body>
               {wrongAnsArr.length !== 0 ? (
                  <>
                     <div className="vstack gap-5 p-3">
                        {wrongAnsArr.map((qn, i) => <DictionaryEntry key={i} qnObj={qn} num={i + 1} />)}
                     </div>

                     <div className="mt-4 d-flex justify-content-center">
                        <Button
                           className="d-flex align-items-center"
                           variant="danger"
                           onClick={() => {
                              setIsReviewShown(!isReviewShown);
                              showWrongQnsAgain();
                           }}
                        ><RotateCcw size={20}/>&nbsp;Redo These Questions</Button>
                     </div>
                  </>
               ) : (
                  <div className="my-4 d-flex justify-content-center fst-italic text-secondary">
                     No incorrect questions yet
                  </div>
               )}
            </Modal.Body>
         </Modal>
      </Col>
   );
};