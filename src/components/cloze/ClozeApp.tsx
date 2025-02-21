"use client";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import useClozeCtxProvider from "./useClozeCtxProvider";
import ClozeAttemptUI from "./ClozeAttemptUI";
import ClozeCompletedUI from "./ClozeCompletedUI";
import Skeleton from "react-loading-skeleton";
import { UserProfileDocument } from "@/definitions";
import Container from "react-bootstrap/esm/Container";

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

   const { ClozeProvider, useClozeContext } = useClozeCtxProvider({
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

   return <Container>
      <ClozeProvider>
         <Row className="my-3">
            <Col>
               <h5 className="text-center m-0">{mainTitle}</h5>
            </Col>
         </Row>
         <ClozeLoadingSkeleton/>
         <ClozeAttemptUI QnContextToUse={useClozeContext}/>
         <ClozeCompletedUI QnContextToUse={useClozeContext}/>
      </ClozeProvider>
   </Container>
}