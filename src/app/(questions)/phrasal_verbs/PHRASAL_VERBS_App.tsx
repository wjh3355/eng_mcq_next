'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import createGenericMCQProvider from "@/app/ui/components/GenericMCQProvider";

import qnSetIntervals from "@/lib/qnSetIntervals";

const { GenericMCQProvider, useGenericMCQContext } = 
   createGenericMCQProvider('phrasal_verbs', qnSetIntervals.phrasal_verbs);
const PHRASAL_VERBS_QnProvider = GenericMCQProvider;
const usePHRASAL_VERBS_QnContext = useGenericMCQContext;

import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/components/GenericAnsIndicator";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";

function AppTitle() {

   const { qnSetName } = usePHRASAL_VERBS_QnContext();

   return (
      <h4 className="text-center m-0">
         Phrasal Verbs Cloze: <strong>{qnSetName}</strong>
      </h4>
   );
};

export default function PHRASAL_VERBS_App({ slug }: { slug: string[] | undefined }) {

   return (
      <PHRASAL_VERBS_QnProvider slug={slug}>
         <Container>
            <Row className="my-3">
               <GenericErrorContainer QnContextToUse={usePHRASAL_VERBS_QnContext}/>
               <AppTitle />
            </Row>
            <Row>
               <GenericLeftColumn QnContextToUse={usePHRASAL_VERBS_QnContext}/>
               <GenericRightColumn QnContextToUse={usePHRASAL_VERBS_QnContext}/>
            </Row>
            <Row className="my-3">
               <GenericAnsIndicator QnContextToUse={usePHRASAL_VERBS_QnContext}/>
            </Row>
         </Container>
      </PHRASAL_VERBS_QnProvider>
   );
}
