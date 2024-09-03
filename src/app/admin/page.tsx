import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
   const { isAuthenticated, getPermission } = getKindeServerSession();
   const isLoggedIn = await isAuthenticated();
   const hasAdminPermission = await getPermission('add_new_users');

   if (!isLoggedIn || !hasAdminPermission?.isGranted) redirect("/");

   return (
      <Container>
         <Row className="my-3">
            <Col className="text-center">
               <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus cum itaque ut non officia quasi expedita, temporibus minima soluta cumque reiciendis sapiente ullam dicta, et, doloribus accusantium. Saepe, aut rem.
               </p>
            </Col>
         </Row>
      </Container>
   );
};