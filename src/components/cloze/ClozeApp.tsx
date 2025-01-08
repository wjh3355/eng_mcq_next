"use client";

import Row from "react-bootstrap/Row";

import createGenericClozeProvider from "./GenericClozeProvider";
import GenericCloze from "./GenericCloze";
import GenericClozeCompleted from "./GenericClozeCompleted";
import Skeleton from "react-loading-skeleton";

export default function ClozeApp({
   userName,
   qnNumToFetch
}: {
   userName: string
   qnNumToFetch: number
}) {

   const { ClozeProvider, useClozeContext } = createGenericClozeProvider({
      userName,
      qnNumToFetch
   });

   function ClozeLoadingSkeleton() {
      const { isLoading } = useClozeContext();

      if (isLoading) {
         return <Skeleton height={30}/>;
      } else {
         return null;
      }
   }

   return <ClozeProvider>
      <Row className="my-3">
         <h5 className="text-center m-0">Comprehension Cloze {qnNumToFetch}</h5>
      </Row>
      <ClozeLoadingSkeleton/>
      <GenericCloze QnContextToUse={useClozeContext}/>
      <GenericClozeCompleted QnContextToUse={useClozeContext}/>
   </ClozeProvider>;
}