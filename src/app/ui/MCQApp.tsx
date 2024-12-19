"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import createGenericMCQProvider from "@/app/ui/GenericMCQProvider";
import GenericMCQLeft from "./components/GenericMCQLeft";
import GenericMCQRight from "@/app/ui/components/GenericMCQRight";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";
import GenericMCQEnd from "@/app/ui/components/GenericMCQEnd";
import { CurrentQnCategories } from "@/types";

export default function MCQApp({
   qnCategory,
   qnNumArray,
   userName,
   trackQns,
   title,
   isSetRandom
}: {
   qnCategory: CurrentQnCategories,
   qnNumArray: number[],
   userName: string,
   trackQns: boolean,
   title: string,
   isSetRandom: boolean
}) {

   const { MCQProvider, useMCQContext } = createGenericMCQProvider({
      qnCategory,
      qnNumArray,
      userName,
      trackQns,
      isSetRandom
   });

   return <MCQProvider>
      <Container className="mb-4">
         <Row className="my-3">
            <Col>
               <GenericErrorContainer QnContextToUse={useMCQContext}/>
               <h5 className="text-center m-0">{title}</h5>
            </Col>
         </Row>
         <Row>
            <GenericMCQLeft QnContextToUse={useMCQContext}/>
            <GenericMCQRight QnContextToUse={useMCQContext}/>
            <GenericMCQEnd QnContextToUse={useMCQContext}/>
         </Row>
      </Container>
   </MCQProvider>;
}