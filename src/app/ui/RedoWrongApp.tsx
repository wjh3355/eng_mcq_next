"use client";

import { QN_CATEGORIES_DATA } from "@/types";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import createGenericMCQProvider from "@/app/ui/GenericMCQProvider";
import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";
import GenericEndScreen from "@/app/ui/components/GenericEndScreen";
import { CurrentQnCategories } from "@/types";

export default function RedoWrongApp({
   cat,
   wrongQnNums
}: {
   cat: CurrentQnCategories,
   wrongQnNums: number[]
}) {

   const { MCQProvider, useMCQContext } = createGenericMCQProvider({
      qnCategory: cat,
      qnNumArray: wrongQnNums,
      userName: "",
      trackQns: false
   });

   return <MCQProvider>
      <Container className="mb-4">
         <Row className="my-3">
            <Col>
               <GenericErrorContainer QnContextToUse={useMCQContext}/>
               <h5 className="text-center m-0">
                  <strong>{QN_CATEGORIES_DATA[cat].name}</strong> - Redo Incorrect Questions
               </h5>
            </Col>
         </Row>
         <Row>
            <GenericLeftColumn QnContextToUse={useMCQContext}/>
            <GenericRightColumn QnContextToUse={useMCQContext}/>
            <GenericEndScreen QnContextToUse={useMCQContext}/>
         </Row>
      </Container>
   </MCQProvider>;
}