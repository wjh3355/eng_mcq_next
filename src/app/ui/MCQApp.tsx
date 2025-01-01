"use client";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import createGenericMCQProvider from "@/app/ui/GenericMCQProvider";
import GenericMCQLeft from "./components/GenericMCQLeft";
import GenericMCQRight from "@/app/ui/components/GenericMCQRight";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";
import GenericMCQEnd from "@/app/ui/components/GenericMCQEnd";
import { QnCategory } from "@/types";
import DemoMCQLeft from "./components/DemoMCQLeft";
import RedoMCQLeft from "./components/RedoMCQLeft";

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