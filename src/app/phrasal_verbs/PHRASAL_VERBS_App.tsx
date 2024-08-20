'use client';

import { Container, Row } from "react-bootstrap";

import { createGenericMCQProvider } from "@/app/ui/utils/GenericMCQProvider";
import { PHRASAL_VERBS_AllowedSetConfigs } from "@/lib/data";

const { GenericMCQProvider, useGenericMCQContext } = 
   createGenericMCQProvider('phrasal_verbs', PHRASAL_VERBS_AllowedSetConfigs);
const PHRASAL_VERBS_QnProvider = GenericMCQProvider;
const usePHRASAL_VERBS_QnContext = useGenericMCQContext;

import GenericLeftColumn from "@/app/ui/utils/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/utils/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/utils/GenericAnsIndicator";

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
