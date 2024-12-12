import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "next/link";
import Image from "next/image";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { CircleUserRound, FileText, NotebookPen } from "lucide-react";
import ensureUserDataDocExists from "@/serverFuncs/ensureUserDataDocExists";

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

         <Row>
            <Col className="d-flex justify-content-center">
               <Image
                  src="/homepageImage.jpg"
                  width={350}
                  height={204}
                  alt="Photo of a Sunbird"
               />
            </Col>
         </Row>
         <Row>
            <Col className="d-flex justify-content-center">
               <p style={{fontSize: "10px"}}><i>By Rejaul karim.rk - Own work, CC BY-SA 4.0, https://commons.wikimedia.org/w/index.php?curid=92670804</i></p>
            </Col>
         </Row>

         <Row className="mt-3">
            <Col className="d-flex justify-content-center">

         {user 

            ?  <div className="d-flex flex-column gap-3 w-50">
                  <Link
                     className="btn btn-lg btn-primary d-flex align-items-center justify-content-center"
                     href="/questions"
                  >
                     <NotebookPen />&nbsp;MCQ Questions
                  </Link>

                  <Link
                     className="btn btn-lg btn-primary d-flex align-items-center justify-content-center"
                     href="/cloze"
                  >
                     <FileText />&nbsp;Cloze Passage
                  </Link>

                  <Link
                     className="btn btn-lg btn-primary d-flex align-items-center justify-content-center"
                     href="/profile"
                  >
                     <CircleUserRound />&nbsp;Your Profile
                  </Link>
               </div>

            :  <div className="d-flex flex-column w-50">
                  <Link href="/questions/demo" className="btn btn-lg btn-primary d-flex justify-content-center align-items-center">
                     <NotebookPen />&nbsp;Demo Questions
                  </Link>
               </div>
         }
         
            </Col>
         </Row>

      </Container>
   );
}