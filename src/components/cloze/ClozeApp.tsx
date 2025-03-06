"use client";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { ClozeProvider, useClozeContext } from "./useClozeProvider";
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

   return <Container>
      <Row className="my-3">
         <Col>
            <h5 className="text-center m-0">{mainTitle}</h5>
         </Col>
      </Row>
      <ClozeProvider
         user={user}
         qnNum={qnNum}
         isDemo={isDemo}
      >
         <ClozeLoadingSkeleton/>
         <ClozeAttemptUI/>
         <ClozeCompletedUI/>
      </ClozeProvider>
   </Container>
}

function ClozeLoadingSkeleton() {
   const { isLoading } = useClozeContext();

   if (isLoading) {
      return <Skeleton height={30}/>;
   } else {
      return null;
   }
}