"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import createGenericClozeProvider from "./GenericClozeProvider";
import GenericClozeQuestion from "./GenericClozeQuestion";
import GenericClozeCompleted from "./GenericClozeCompleted";
import Skeleton from "react-loading-skeleton";

export default function ClozeApp({
   userName
}: {
   userName: string
}) {

   const { ClozeProvider, useClozeContext } = createGenericClozeProvider(userName);

   function ClozeLoadingSkeleton() {
      const { isLoading } = useClozeContext();

      if (isLoading) {
         return <Skeleton height={30}/>;
      } else {
         return null;
      }
   }

   return <ClozeProvider>
      <Container className="mb-4">
         <Row className="my-3">
            <h5 className="text-center m-0">Comprehension Cloze</h5>
         </Row>
         <ClozeLoadingSkeleton/>
         <GenericClozeQuestion QnContextToUse={useClozeContext}/>
         <GenericClozeCompleted QnContextToUse={useClozeContext}/>
      </Container>
   </ClozeProvider>;
}