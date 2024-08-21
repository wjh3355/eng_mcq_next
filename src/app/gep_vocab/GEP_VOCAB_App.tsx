'use client';

import { Container, Row } from "react-bootstrap";

import { createGenericMCQProvider } from "../ui/components/GenericMCQProvider";
import { GEP_VOCAB_AllowedSetConfigs } from "@/lib/data";

const { GenericMCQProvider, useGenericMCQContext } = 
   createGenericMCQProvider('gep_vocab', GEP_VOCAB_AllowedSetConfigs);
const GEP_VOCAB_QnProvider = GenericMCQProvider;
const useGEP_VOCAB_QnContext = useGenericMCQContext;

import GenericLeftColumn from "../ui/components/GenericLeftColumn";
import GenericRightColumn from "../ui/components/GenericRightColumn";
import GenericAnsIndicator from "../ui/components/GenericAnsIndicator";

function AppTitle() {
   
   const { qnSet } = useGEP_VOCAB_QnContext();
   
   return (
      <h4 className="text-center m-0">
         GEP English Vocabulary MCQ: <strong>{qnSet}</strong>
      </h4>
   );
};

export default function GEP_VOCAB_App({ slug }: { slug: string[] | undefined }) {

   return (
      <GEP_VOCAB_QnProvider slug={slug}>
         <Container>
            <Row className="my-3">
               <AppTitle />
            </Row>
            <Row>
               <GenericLeftColumn QnContextToUse={useGEP_VOCAB_QnContext}/>
               <GenericRightColumn QnContextToUse={useGEP_VOCAB_QnContext}/>
            </Row>
            <Row className="my-3">
               <GenericAnsIndicator QnContextToUse={useGEP_VOCAB_QnContext}/>
            </Row>
         </Container>
      </GEP_VOCAB_QnProvider>
   );
}
