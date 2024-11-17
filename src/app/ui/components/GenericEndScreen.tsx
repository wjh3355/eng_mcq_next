"use client";

import { MCQContextValue } from "@/types";

import { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import PaginatedDictEntries from "./PaginatedDictEntries";
import { RotateCcw, BookText, CircleCheckBig } from "lucide-react";

export default function GenericEndScreen({ QnContextToUse }: { QnContextToUse: () => MCQContextValue }) {

   const { 
      hasReachedEnd,
      score: [numCorrect, numTotal],
      wrongAnsArr,
      redoSet
   } = QnContextToUse();

   const [isReviewShown, setIsReviewShown] = useState(false);

   if (!hasReachedEnd) return null;

   return (
      <>
         <Col>
            <Card body>
               <div className="vstack gap-4 text-center p-3">

                  <div>
                     <CircleCheckBig size={48} className="text-primary"/>
                  </div>

                  <h4>You reached the end of this set</h4>

                  <div className="d-flex justify-content-center">
                     <Button
                        size="lg"
                        variant="danger"
                        className="d-flex align-items-center"
                        onClick={() => redoSet()}
                     >
                        <RotateCcw/>&nbsp;Redo Set
                     </Button>
                  </div>

                  <Container>
                     <Row>
                        <Col md={6} className="border-0 bg-warning-subtle rounded p-3">
                           <div className="hstack gap-3 d-inline-flex">
                              <div className="text-center">
                                 Correct<br/><span className="fs-5 text-success">{numCorrect}</span>
                              </div>

                              <div className="vr"/>

                              <div className="text-center">
                                 Total<br/><span className="fs-5 text-primary">{numTotal}</span>
                              </div>

                              <div className="vr"/>

                              <div className="text-center">
                                 Result<br/><span className="fs-5 text-danger">{
                                    numTotal === 0
                                    ? 0
                                    : Math.round(100*numCorrect/numTotal)
                                 }%</span>
                              </div>
                           </div>
                        </Col>
                        <Col md={6} className="d-flex align-items-center justify-content-center mt-md-0 mt-3">
                           <Button
                              className="d-flex align-items-center"
                              size="lg"
                              onClick={() => setIsReviewShown(!isReviewShown)}
                           >
                              <BookText/>&nbsp;View Incorrect Questions
                           </Button>
                        </Col>
                     </Row>
                  </Container>
               </div>
            </Card>
         </Col>

         <Modal size="lg" centered
            show={isReviewShown}
            onHide={() => setIsReviewShown(!isReviewShown)}
         >
            <Modal.Header closeButton><Modal.Title className="fs-5">Review Incorrect Questions</Modal.Title></Modal.Header>
            <Modal.Body><PaginatedDictEntries qnObjArr={wrongAnsArr}/></Modal.Body>
         </Modal>
      </>
   )
}