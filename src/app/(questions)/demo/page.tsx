'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import createGenericMCQProvider from "@/app/ui/components/GenericMCQProvider";

import qnCategoriesData from "@/lib/data";

const { 
   GenericMCQProvider: DemoProvider,
   useGenericMCQContext: useDemoQnContext
} = createGenericMCQProvider(qnCategoriesData.demo);

import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/components/GenericAnsIndicator";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";
import GenericQnStopwatch from "@/app/ui/components/GenericQnStopwatch";

export default function Page() {
   return (
      <DemoProvider slug={undefined}>
         <Container>
            <Row className="my-3">
               <GenericErrorContainer QnContextToUse={useDemoQnContext} />
               <h4 className="text-center m-0">
                  Demo Questions
               </h4>
            </Row>
            <Row>
               <GenericLeftColumn QnContextToUse={useDemoQnContext} />
               <GenericRightColumn QnContextToUse={useDemoQnContext} />
            </Row>
            <Row className="my-3">
               <GenericAnsIndicator QnContextToUse={useDemoQnContext} />
            </Row>
            <Row className="my-3">
               <Col className="d-flex justify-content-end">
                  <GenericQnStopwatch QnContextToUse={useDemoQnContext}/>
               </Col>
            </Row>
         </Container>
      </DemoProvider>
   );
}
