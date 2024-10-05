'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import createGenericMCQProvider from "@/app/ui/components/GenericMCQProvider";

import qnSetIntervals from "@/lib/qnSetIntervals";

const { GenericMCQProvider, useGenericMCQContext } = 
   createGenericMCQProvider('gep', qnSetIntervals.gep);
const GEP_QnProvider = GenericMCQProvider;
const useGEP_QnContext = useGenericMCQContext;

import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/components/GenericAnsIndicator";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";

function AppTitle() {
   
   const { qnSetName } = useGEP_QnContext();
   
   return (
      <h4 className="text-center m-0">
         GEP Vocab MCQ: <strong>{qnSetName}</strong>
      </h4>
   );
};

export default function GEP_App({ slug }: { slug: string[] | undefined }) {

   return (
      <GEP_QnProvider slug={slug}>
         <Container>
            <Row className="my-3">
               <GenericErrorContainer QnContextToUse={useGEP_QnContext}/>
               <AppTitle />
            </Row>
            <Row>
               <GenericLeftColumn QnContextToUse={useGEP_QnContext}/>
               <GenericRightColumn QnContextToUse={useGEP_QnContext}/>
            </Row>
            <Row className="my-3">
               <GenericAnsIndicator QnContextToUse={useGEP_QnContext}/>
            </Row>
         </Container>
      </GEP_QnProvider>
   );
}
