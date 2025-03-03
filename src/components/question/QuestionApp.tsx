"use client";

import React from "react";
import { QuestionProvider } from "./QuestionProvider";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import QuestionLeftUI from "./QuestionLeftUI";
import QuestionRightUI from "./QuestionRightUI";
import QuestionEndUI from "./QuestionEndUI";
import { Collections } from "@/definitions";
import QuestionProgressBar from "./QuestionProgressBar";

export default function QuestionApp({
   title,
   qnNumArray,
   collection,
   email,
   nextSetNum,
   isThisSetRandom
}: {
   title: string
   qnNumArray: number[]
   collection: Collections
   email: string
   nextSetNum: number | null
   isThisSetRandom: boolean
}) {

   return (
      <Container>
         <Row className="my-3">
            <Col>
               <h5 className="text-center m-0">{title}</h5>
            </Col>
         </Row>
         <Row>
            <QuestionProvider
               qnNumArray={qnNumArray}
               collection={collection}
               email={email}
            >
               <QuestionLeftUI/>
               <QuestionRightUI/>
               <QuestionEndUI
                  nextSetNum={nextSetNum}
                  isThisSetRandom={isThisSetRandom}
               />
               <QuestionProgressBar/>
            </QuestionProvider>
         </Row>
      </Container>
   )
}
