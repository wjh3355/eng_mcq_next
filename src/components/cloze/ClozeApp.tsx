"use client";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import createGenericClozeProvider from "./GenericClozeProvider";
import GenericCloze from "./GenericCloze";
import GenericClozeCompleted from "./GenericClozeCompleted";
import Skeleton from "react-loading-skeleton";
import { UserProfileDocument } from "@/definitions";
import Container from "react-bootstrap/esm/Container";
import { TriangleAlert } from "lucide-react";

export default function ClozeApp({
   user,
   qnNum,
   isDemo,
   mainTitle
}: {
   user: UserProfileDocument
   qnNum: number
   isDemo: boolean
   mainTitle: string
}) {

   const { ClozeProvider, useClozeContext } = createGenericClozeProvider({
      user,
      qnNum,
      isDemo
   });

   function ClozeLoadingSkeleton() {
      const { isLoading } = useClozeContext();

      if (isLoading) {
         return <Skeleton height={30}/>;
      } else {
         return null;
      }
   }

   function ErrorContainer() {
      const { error } = useClozeContext();

      if (!error) return;

      return (
         <Alert variant="danger" dismissible className="d-flex align-items-center">
            <TriangleAlert />&nbsp;<strong>Error: {error}</strong>
         </Alert>
      );
   }

   return <Container>
      <ClozeProvider>
         <Row className="my-3">
            <Col>
               <ErrorContainer/>
               <h5 className="text-center m-0">{mainTitle}</h5>
            </Col>
         </Row>
         <ClozeLoadingSkeleton/>
         <GenericCloze QnContextToUse={useClozeContext}/>
         <GenericClozeCompleted QnContextToUse={useClozeContext}/>
      </ClozeProvider>
   </Container>
}