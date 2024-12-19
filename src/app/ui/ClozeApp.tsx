"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import createGenericClozeProvider from "../ui/GenericClozeProvider";
import GenericCloze from "../ui/components/GenericCloze";
import GenericClozeCompleted from "../ui/components/GenericClozeCompleted";
import Skeleton from "react-loading-skeleton";
import { CLOZE_QNNUM_ARR } from "@/types";
import { notFound } from "next/navigation";

export default function ClozeApp({
   userName,
   qnNumToFetch
}: {
   userName: string
   qnNumToFetch: number
}) {

   if (!CLOZE_QNNUM_ARR.includes(qnNumToFetch)) notFound();

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
      <Container className="mb-4">
         <Row className="my-3">
            <h5 className="text-center m-0">Comprehension Cloze</h5>
         </Row>
         <ClozeLoadingSkeleton/>
         <GenericCloze QnContextToUse={useClozeContext}/>
         <GenericClozeCompleted QnContextToUse={useClozeContext}/>
      </Container>
   </ClozeProvider>;
}