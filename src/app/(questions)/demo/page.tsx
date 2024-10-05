'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import createGenericMCQProvider from "@/app/ui/components/GenericMCQProvider";

import qnSetIntervals from "@/lib/qnSetIntervals";

const { GenericMCQProvider, useGenericMCQContext } = 
   createGenericMCQProvider('demo', qnSetIntervals.demo);
const DEMO_QnProvider = GenericMCQProvider;
const useDEMO_QnContext = useGenericMCQContext;

import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/components/GenericAnsIndicator";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";
import GenericQnStopwatch from "@/app/ui/components/GenericQnStopwatch";

export default function Page() {
   return (
      <DEMO_QnProvider slug={undefined}>
         <Container>
            <Row className="my-3">
               <GenericErrorContainer QnContextToUse={useDEMO_QnContext} />
               <h4 className="text-center m-0">
                  Demo Questions
               </h4>
            </Row>
            <Row>
               <GenericLeftColumn QnContextToUse={useDEMO_QnContext} />
               <GenericRightColumn QnContextToUse={useDEMO_QnContext} />
            </Row>
            <Row className="my-3">
               <GenericAnsIndicator QnContextToUse={useDEMO_QnContext} />
            </Row>
            <Row className="my-3">
               <Col className="d-flex justify-content-end">
                  <GenericQnStopwatch QnContextToUse={useDEMO_QnContext}/>
               </Col>
            </Row>
         </Container>
      </DEMO_QnProvider>
   );
}
