"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import createGenericClozeProvider from "./GenericClozeProvider";
import GenericClozeQuestion from "./GenericClozeQuestion";
import ClozeEndScreen from "../ui/components/ClozeEndScreen";

export default function Page() {

   const { ClozeProvider, useClozeContext } = createGenericClozeProvider({
      qnNumArray: [1, 2]
   });

   return <ClozeProvider>
      <Container className="mb-4">
         <Row className="my-3">
            <h5 className="text-center m-0">Comprehension Cloze</h5>
         </Row>
         <Row>
            <Col>
               <GenericClozeQuestion QnContextToUse={useClozeContext}/>
            </Col>
         </Row>
         <ClozeEndScreen QnContextToUse={useClozeContext}/>
      </Container>
   </ClozeProvider>;
}