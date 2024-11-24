"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

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
         <GenericClozeQuestion QnContextToUse={useClozeContext}/>
         <ClozeEndScreen QnContextToUse={useClozeContext}/>
      </Container>
   </ClozeProvider>;
}