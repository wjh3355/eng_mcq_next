import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "next/link";
import { connectToDB } from "@/lib/connectToDB";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const dynamic = 'force-dynamic';

export default async function Page() {
   const noticeHtml = await getNoticeHtmlStr();
   const { isAuthenticated } = getKindeServerSession();
   const isLoggedIn = await isAuthenticated();

   return (
      <Container>
         <Row className="my-3">
            <Col className="text-center">
               <h5>Welcome to Sunbird English</h5>
            </Col>
         </Row>

         <Row>
            <Col>
               <div className="card">
                  <div className="card-header">Notice</div>
                  <div className="card-body">
                     <div
                        className="card-text"
                        dangerouslySetInnerHTML={noticeHtml}
                     />
                  </div>
               </div>
            </Col>
         </Row>

         {isLoggedIn ? null : (
            <Row className="mt-3">
               <Col className="d-flex justify-content-center">
                  <Link href="/demo" className="btn btn-lg btn-primary">
                     📝 Demo Questions
                  </Link>
               </Col>
            </Row>
         )}
         
      </Container>
   );
}

async function getNoticeHtmlStr() {
   try {
      const { db } = await connectToDB("notices");
      const data = await db
         .collection("notice")
         .findOne({}, { projection: { _id: 0, html: 1 } });
      
      return { __html: data?.html! as string };
   } catch (error) {
      console.error("Could not fetch notice for homepage:", error);
      return { __html: "<p>An error occured, try again later.</p>" };
   }
}