"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import createGenericMCQProvider from "@/app/ui/GenericMCQProvider";
import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";
import GenericEndScreen from "@/app/ui/components/GenericEndScreen";
import { CurrentQnCategories } from "@/types";

export default function QuestionsApp({
   qnCategory,
   qnNumArray,
   userName,
   trackQns,
   title
}: {
   qnCategory: CurrentQnCategories,
   qnNumArray: number[],
   userName: string,
   trackQns: boolean,
   title: string
}) {

   const { MCQProvider, useMCQContext } = createGenericMCQProvider({
      qnCategory,
      qnNumArray,
      userName,
      trackQns
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
            <GenericLeftColumn QnContextToUse={useMCQContext}/>
            <GenericRightColumn QnContextToUse={useMCQContext}/>
            <GenericEndScreen QnContextToUse={useMCQContext}/>
         </Row>
      </Container>
   </MCQProvider>;
}