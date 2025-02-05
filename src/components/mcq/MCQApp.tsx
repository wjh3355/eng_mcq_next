"use client";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import createGenericMCQProvider from "./GenericMCQProvider";
import GenericMCQLeft from "./GenericMCQLeft";
import GenericMCQRight from "./GenericMCQRight";
import GenericMCQEnd from "./GenericMCQEnd";
import { QnCategory } from '@/definitions';
import DemoMCQLeft from "./DemoMCQLeft";
import RedoMCQLeft from "./RedoMCQLeft";
import GenericProgressBar from "./GenericProgressBar";
import Container from "react-bootstrap/esm/Container";
import { TriangleAlert } from "lucide-react";

export default function MCQApp({
   qnCategory,
   qnNumArray,
   email,
   title,
   isSetRandom,
   isRedo
}: {
   qnCategory: QnCategory | "demo",
   qnNumArray: number[],
   email: string,
   title: string,
   isSetRandom: boolean,
   isRedo: boolean
}) {

   const { MCQProvider, useMCQContext } = createGenericMCQProvider({
      qnCategory,
      qnNumArray,
      email,
      isSetRandom,
      isRedo
   });

   function ErrorContainer() {
      const { error } = useMCQContext();

      if (!error) return;

      return (
         <Alert variant="danger" dismissible className="d-flex align-items-center">
            <TriangleAlert />&nbsp;<strong>Error: {error}</strong>
         </Alert>
      );
   }

   return <Container>
      <MCQProvider>
         <Row className="my-3">
            <Col>
               <ErrorContainer/>
               <h5 className="text-center m-0">{title}</h5>
            </Col>
         </Row>
         <Row>
            {qnCategory === "demo"
               ?  <DemoMCQLeft QnContextToUse={useMCQContext}/>
               :  (isRedo
                  ?  <RedoMCQLeft QnContextToUse={useMCQContext}/>
                  :  <GenericMCQLeft QnContextToUse={useMCQContext}/>
               )
            }
            <GenericMCQRight QnContextToUse={useMCQContext}/>
            <GenericMCQEnd QnContextToUse={useMCQContext}/>

            <GenericProgressBar QnContextToUse={useMCQContext}/>
         </Row>
      </MCQProvider>
   </Container>
}