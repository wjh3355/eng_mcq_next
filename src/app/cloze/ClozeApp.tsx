"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import createGenericClozeProvider from "./GenericClozeProvider";
import GenericClozeQuestion from "./GenericClozeQuestion";
import GenericClozeCompleted from "./GenericClozeCompleted";

export default function ClozeApp({
   userName
}: {
   userName: string
}) {

   const { ClozeProvider, useClozeContext } = createGenericClozeProvider(userName);

   return <ClozeProvider>
      <Container className="mb-4">
         <Row className="my-3">
            <h5 className="text-center m-0">Comprehension Cloze</h5>
         </Row>
         <GenericClozeQuestion QnContextToUse={useClozeContext}/>
         <GenericClozeCompleted QnContextToUse={useClozeContext}/>
      </Container>
   </ClozeProvider>;
}