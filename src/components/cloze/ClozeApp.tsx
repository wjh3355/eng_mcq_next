"use client";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { ClozeProvider } from "./ClozeProvider";
import ClozeAttemptUI from "./ClozeAttemptUI";
import { Cloze, UserProfileDocument } from "@/definitions";
import Container from "react-bootstrap/esm/Container";
import ClozeStatusUI from "./ClozeStatusUI";

export default function ClozeApp({
   user,
   cloze,
   isDemo
}: {
   user: UserProfileDocument
   cloze: Cloze
   isDemo: boolean
}) {

   return <Container>
      <Row className="my-3">
         <Col>
            <h5 className="text-center m-0">
               {isDemo
                  ?  "Demo Comprehension Cloze"
                  :  `Comprehension Cloze - Q${cloze.qnNum}`
               }
            </h5>
         </Col>
      </Row>
      <ClozeProvider
         user={user}
         cloze={cloze}
         isDemo={isDemo}
      >
         <ClozeAttemptUI/>
         <ClozeStatusUI/>
      </ClozeProvider>
   </Container>
}