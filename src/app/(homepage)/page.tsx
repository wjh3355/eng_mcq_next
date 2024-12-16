import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "next/link";
// import Image from "next/image";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { CircleUserRound, FileText, NotebookPen } from "lucide-react";
import ensureUserDataDocExists from "@/serverFuncs/ensureUserDataDocExists";
import Sunbirds from "./Sunbirds";

export const dynamic = 'force-dynamic';

export default async function Page() {
   const { getUser } = getKindeServerSession();
   const user = await getUser();

   if (user) await ensureUserDataDocExists(user.given_name!);

   return (
      <Container className="mb-4">
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">Welcome to Sunbird English</h5>
            </Col>
         </Row>

         <Sunbirds/>

         <Row className="mt-3">
            <Col className="d-flex justify-content-center">

               {user 

                  ?  <div className="d-flex flex-column gap-3 w-50">
                        <Link
                           className="btn btn-lg btn-primary d-flex align-items-center justify-content-center"
                           href="/mcq"
                        >
                           <NotebookPen className="me-2"/>MCQ Questions
                        </Link>

                        <Link
                           className="btn btn-lg btn-primary d-flex align-items-center justify-content-center"
                           href="/cloze"
                        >
                           <FileText className="me-2"/>Cloze Passage
                        </Link>

                        <Link
                           className="btn btn-lg btn-primary d-flex align-items-center justify-content-center"
                           href="/profile"
                        >
                           <CircleUserRound className="me-2"/>Your Profile
                        </Link>
                     </div>

                  :  <div className="d-flex flex-column w-50">
                        <Link href="/mcq/sets/demo" className="btn btn-lg btn-primary d-flex justify-content-center align-items-center">
                           <NotebookPen className="me-2"/>Demo MCQ Questions
                        </Link>
                     </div>
               }
         
            </Col>
         </Row>

      </Container>
   );
}