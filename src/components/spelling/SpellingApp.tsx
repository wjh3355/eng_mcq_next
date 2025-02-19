"use client";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import Container from "react-bootstrap/esm/Container";
import { TriangleAlert } from "lucide-react";
import useSpellingCtxProvider from "./useSpellingCtxProvider";
import SpellingUI from "./SpellingUI";
import SpellingEndUI from "./SpellingEndUI";
import GenericProgressBar from "../GenericProgressBar";

export default function SpellingApp({
   email,
   qnNumArray,
   title,
   setInfo,
   isRandom,
}: {
   email: string,
   qnNumArray: number[]
   title: string
   setInfo: [number, number]
   isRandom: boolean
}) {

   // initialize the SpellingProvider with the appropriate context
   const { SpellingProvider, useSpellingContext } = useSpellingCtxProvider({ qnNumArray, email, setInfo, isRandom });

   return <Container>
      <SpellingProvider>
         <Row className="my-3">
            <Col>
               <h5 className="text-center m-0">{title}</h5>
            </Col>
         </Row>
         <Row>
            <SpellingUI QnContextToUse={useSpellingContext}/>
            <SpellingEndUI QnContextToUse={useSpellingContext}/>
            <GenericProgressBar QnContextToUse={useSpellingContext}/>
         </Row>
      </SpellingProvider>
   </Container>
}