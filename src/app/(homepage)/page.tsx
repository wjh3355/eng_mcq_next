import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "next/link";
import { connectToDB } from "@/lib/connectToDB";

async function getNotice() {
   try {
      const { db } = await connectToDB("notices");
      const data = await db
         .collection("notice")
         .findOne({}, { projection: { _id: 0, html: 1 } });
      return data?.html || "";
   } catch (error) {
      console.error("Could not fetch notice for homepage:", error);
      return "";
   }
};

export default async function Page() {
   const noticeHtml = await getNotice();

   return (
      <Container>
         <Row className="mt-3">
            <Col className="text-center">
               <h4>Welcome to Sunbird English</h4>
            </Col>
         </Row>

         <Row className="mt-3">
            <Col>
               <div className="card">
                  <div className="card-header">Notice</div>
                  <div className="card-body">
                     <div
                        className="card-text"
                        dangerouslySetInnerHTML={{ __html: noticeHtml }}
                     />
                  </div>
               </div>
            </Col>
         </Row>

         <Row className="mt-3">
            <Col className="d-flex justify-content-center">
               <Link href="/demo" className="btn btn-lg btn-primary">
                  Demo Questions
               </Link>
            </Col>
         </Row>
      </Container>
   );
};