// "use client";

import { Container, Row } from "react-bootstrap";

import GEPTitle from "@/app/ui/GEPTitle";
import LeftColumn from "@/app/ui/LeftColumn";
import RightColumn from "@/app/ui/RightColumn";
import AnswerIndicator from "@/app/ui/AnswerIndicator";

import { GEPQnProvider } from "@/app/utils/GEPQnProvider";

export default function Page({ params }) {

   return (


      <GEPQnProvider slug={params.slug}>
         <Container>
            <GEPTitle slug={params.slug} />

            <Row>
               <LeftColumn />
               <RightColumn />
            </Row>
         </Container>

         <AnswerIndicator />
      </GEPQnProvider>


   );
}
