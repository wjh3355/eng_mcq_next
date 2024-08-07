import { Container, Row } from "react-bootstrap";

import LeftColumn from "@/app/ui/LeftColumn";
import RightColumn from "@/app/ui/RightColumn";
import Score from "@/app/ui/Score";

import { GEPQnProvider } from "@/app/utils/GEPQnProvider";

export default function Page({ params }) {

   return (
      <GEPQnProvider rangeOfQns={params.slug}>
         <Container className="mt-3">
            <Row>
               <LeftColumn/>
               <RightColumn />
            </Row>
         </Container>

         <Score/>
      </GEPQnProvider>   
   );
}