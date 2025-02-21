"use client";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import useMCQCtxProvider from "./useMCQCtxProvider";
import GenericMCQLeft from "./GenericMCQLeft";
import GenericMCQRight from "./GenericMCQRight";
import GenericMCQEnd from "./GenericMCQEnd";
import { McqCategory } from '@/definitions';
import DemoMCQLeft from "./DemoMCQLeft";
import RedoMCQLeft from "./RedoMCQLeft";
import GenericProgressBar from "../GenericProgressBar";
import Container from "react-bootstrap/esm/Container";

export default function MCQApp({
   McqCategory,
   qnNumArray,
   email,
   title,
   isSetRandom,
   isRedo
}: {
   McqCategory: McqCategory | "demo",
   qnNumArray: number[],
   email: string,
   title: string,
   isSetRandom: boolean,
   isRedo: boolean
}) {

   // initialize the MCQProvider with the appropriate context
   const { MCQProvider, useMCQContext } = useMCQCtxProvider({
      McqCategory,
      qnNumArray,
      email,
      isSetRandom,
      isRedo
   });

   return <Container>
      <MCQProvider>
         <Row className="my-3">
            <Col>
               <h5 className="text-center m-0">{title}</h5>
            </Col>
         </Row>
         <Row>
            {McqCategory === "demo"
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