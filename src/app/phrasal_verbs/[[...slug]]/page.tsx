import { Col, Container, Row } from "react-bootstrap";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
   const { isAuthenticated } = getKindeServerSession();
   const isLoggedIn = await isAuthenticated();
   if (!isLoggedIn) {
      redirect("/");
   }

   return(
      <Container className="my-3">
         <Row>
            <Col className="text-center">
               <h4>Phrasal Verbs coming soon</h4>
            </Col>
         </Row>
      </Container>
   );
}