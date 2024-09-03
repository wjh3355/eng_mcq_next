'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { createGenericMCQProvider } from "../ui/components/GenericMCQProvider";
import { PHRASAL_VERBS_AllowedSetConfigs } from "@/lib/data";

const { GenericMCQProvider, useGenericMCQContext } = 
   createGenericMCQProvider('phrasal_verbs', PHRASAL_VERBS_AllowedSetConfigs);
const PHRASAL_VERBS_QnProvider = GenericMCQProvider;
const usePHRASAL_VERBS_QnContext = useGenericMCQContext;

import GenericLeftColumn from "../ui/components/GenericLeftColumn";
import GenericRightColumn from "../ui/components/GenericRightColumn";
import GenericAnsIndicator from "../ui/components/GenericAnsIndicator";
import GenericErrorContainer from "../ui/components/GenericErrorContainer";

function AppTitle() {

   const { qnSet } = usePHRASAL_VERBS_QnContext();

   return (
      <h4 className="text-center m-0">
         Phrasal Verbs MCQ: <strong>{qnSet}</strong>
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
