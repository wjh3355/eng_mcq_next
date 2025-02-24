"use client";

import { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import { RotateCcw, BookText, CircleCheckBig } from "lucide-react";
import { useDefinitionContext } from "./DefinitionContext";

export default function DefinitionEndUI() {

   const { 
      setInfo: { hasReachedEnd },
      userInfo: { numCorrect, numAttempted, wrongAnsArr },
      callbacks: { redoSet },
   } = useDefinitionContext();

   const [isReviewShown, setIsReviewShown] = useState(false);

   if (!hasReachedEnd) return null;

   return (
      <>
         <Col lg={8} className="mx-auto">
            <Card body className='shadow-lg border-0'>
               <div className="vstack gap-4 p-3">

                  <CircleCheckBig size={48} className="text-primary mx-auto"/>

                  <h4 className="text-center">You reached the end of set X</h4>

                  <div className="d-flex justify-content-center hstack gap-3">
                     <Button
                        size="lg"
                        variant="outline-danger"
                        className="d-flex align-items-center"
                        onClick={() => redoSet()}
                     >
                        <RotateCcw className='me-1'/>Redo this set
                     </Button>
                     {/* {isRandom
                        ?
                           <Button
                              size="lg"
                              variant="secondary"
                              className="d-flex align-items-center"
                              onClick={() => window.location.reload()}
                           >
                              <Lightbulb/>&nbsp;New Random Set
                           </Button>
                        :
                           <Button
                              size="lg"
                              variant="success"
                              className="d-flex align-items-center"
                              onClick={() => router.push(setNum === numTotalSets ? "/spelling" : `/spelling/${setNum + 1}`)}
                           >
                              {setNum === numTotalSets
                                 ?  "Return to all sets"
                                 :  `Next: set ${setNum + 1}`
                              }
                           </Button>
                     } */}
                  </div>

                  <Container>
                     <Row>
                        <Col md={6} className="border-0 bg-warning-subtle rounded p-3 text-center">
                           <div className="hstack gap-3 d-inline-flex">
                              <div className="text-center">
                                 Correct<br/><span className="fs-5 text-success">{numCorrect}</span>
                              </div>

                              <div className="vr"/>

                              <div className="text-center">
                                 Total<br/><span className="fs-5 text-primary">{numAttempted}</span>
                              </div>

                              <div className="vr"/>

                              <div className="text-center">
                                 Result<br/><span className="fs-5 text-danger">{
                                    numAttempted === 0
                                    ? 0
                                    : Math.round(100*numCorrect/numAttempted)
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
            <Modal.Body>
               {wrongAnsArr.map(({ definitionToTest, correctAns, type }, idx) =>
                  <p key={idx}>
                     {`${correctAns} (${type}): ${definitionToTest}`}
                  </p>
               )}
            </Modal.Body>
         </Modal>
      </>
   )
}