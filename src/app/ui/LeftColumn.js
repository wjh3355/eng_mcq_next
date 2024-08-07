'use client';

import { Button, Card, Col, Collapse, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

import Question from "./Question";
import Explanation from "./Explanation";
import Review from "./Review";

import { useGEPQnContext } from "../utils/GEPQnProvider";

export default function LeftColumn() {

   const { handleNextQnBtnClick, isNextQnBtnDisabled, isExplBtnDisabled } = useGEPQnContext();

   const [isExplShown, setIsExplShown] = useState(false);
   const [isReviewShown, setIsReviewShown] = useState(false);

   useEffect(() => {
      isExplBtnDisabled && setIsExplShown(false);
   }, [isExplBtnDisabled])

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
               Review
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
            <div>{!isExplBtnDisabled && <Explanation />}</div>
         </Collapse>

         <Modal
            show={isReviewShown}
            onHide={() => setIsReviewShown(!isReviewShown)}
            size="lg"
            centered
         >
            <Modal.Header closeButton>
               <Modal.Title>Review of incorrect answers</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Review />
            </Modal.Body>
         </Modal>
      </Col>
   );
}