"use client";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import createGenericMCQProvider from "./GenericMCQProvider";
import GenericMCQLeft from "./GenericMCQLeft";
import GenericMCQRight from "./GenericMCQRight";
import GenericErrorContainer from "./GenericErrorContainer";
import GenericMCQEnd from "./GenericMCQEnd";
import { QnCategory } from "@/types";
import DemoMCQLeft from "./DemoMCQLeft";
import RedoMCQLeft from "./RedoMCQLeft";

export default function MCQApp({
   qnCategory,
   qnNumArray,
   userName,
   title,
   isSetRandom,
   isRedo
}: {
   qnCategory: QnCategory | "demo",
   qnNumArray: number[],
   userName: string,
   title: string,
   isSetRandom: boolean,
   isRedo: boolean
}) {

   const { MCQProvider, useMCQContext } = createGenericMCQProvider({
      qnCategory,
      qnNumArray,
      userName,
      isSetRandom,
      isRedo
   });

   return <MCQProvider>
      <Row className="my-3">
         <Col>
            <GenericErrorContainer QnContextToUse={useMCQContext}/>
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
      </Row>
   </MCQProvider>;
}