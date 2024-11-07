import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import fetchHomepageNotice from "@/lib/fetchHomepageNotice";
import { NotebookPen } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Page() {
   const { isAuthenticated } = getKindeServerSession();
   const isLoggedIn = await isAuthenticated();

   return (
      <Container className="mb-4">
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">Welcome to Sunbird English</h5>
            </Col>
         </Row>

         <Row>
            <Col>
               <div className="card">
                  <div className="card-header">Notice</div>
                  <div className="card-body">
                     <Suspense fallback={<><Skeleton height={22.5} className="mb-1"/><Skeleton height={22.5}/></>}>
                        <Notice/>
                     </Suspense>
                  </div>
               </div>
            </Col>
         </Row>

         {!isLoggedIn && (
            <Row className="mt-3">
               <Col className="d-flex justify-content-center">
                  <Link href="/demo" className="btn btn-lg btn-primary d-flex align-items-center">
                     <NotebookPen />&nbsp;Demo Questions
                  </Link>
               </Col>
            </Row>
         )}
         
      </Container>
   );
}

async function Notice() {
   const noticeHtml = await fetchHomepageNotice();
   return <div className="card-text" dangerouslySetInnerHTML={noticeHtml} />;
}