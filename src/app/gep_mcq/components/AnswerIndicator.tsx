'use client';

import { Container, Row, Col } from "react-bootstrap";
import { useGEPQnContext } from "../provider/GEPQnProvider";

export default function AnswerIndicator() {
   const { isCorrect } = useGEPQnContext();

   switch (isCorrect) {
      case true:
         return (
            <Container>
               <Row>
                  <Col className="d-flex justify-content-center my-3">
                     <div
                        className="px-3 py-1 rounded-5 border-bottom border-2 d-inline-block"
                        style={{ 
                           backgroundColor: "rgb(220, 255, 220)", 
                           fontSize: "18px" 
                        }}
                     >
                        <div className="d-flex align-items-center">
                           <i
                              className="bi bi-check2"
                              style={{
                                 color: "green",
                                 fontSize: "20px",
                              }}
                           ></i>
                           &nbsp;
                           <span style={{color: "green"}}>Correct</span>
                        </div>
                     </div>
                  </Col>
               </Row>
            </Container>
         );
      case false:
         return (
            <Container>
               <Row>
                  <Col className="d-flex justify-content-center my-3">
                     <div
                        className="px-3 py-1 rounded-5 border-bottom border-2 d-inline-block"
                        style={{
                           backgroundColor: "rgb(255, 220, 220)",
                           fontSize: "18px",
                        }}
                     >
                        <div className="d-flex align-items-center">
                           <i
                              className="bi bi-x-lg"
                              style={{
                                 color: "rgb(190, 44, 44)",
                                 fontSize: "18px",
                              }}
                           ></i>
                           &nbsp;
                           <span style={{ color: "rgb(190, 44, 44)" }}>Incorrect</span>
                        </div>
                     </div>
                  </Col>
               </Row>
            </Container>
         );
      case null:
         return;
   }
}