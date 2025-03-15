import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Sunbirds from "@/components/homepg/Sunbirds";
import { auth } from "@/auth";
import Advert from "@/components/homepg/Advert";
import Link from "next/link";
import { CircleUserRound, FileText, FlaskConical, NotebookPen, SpellCheck2, WholeWord } from "lucide-react";

export const revalidate = 3600;

export default async function Page() {

   const session = await auth();
   
   return (
      <Container>
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">Revise for the PSLE English Paper</h5>
               {/* <Alert variant="info border-0 shadow" className="mt-3">
                  ⚠️ <strong>Notice:</strong> With effect from 19th February 2025, the authentication system will be overhauled. Existing users are required to <Link href="/auth/reset-password">reset their password</Link> before logging in. We apologise for any inconvenience caused. 若您是现有用户，请在登录前<Link href="/auth/reset-password">重设密码</Link>。我们为此给您带来的不便致以歉意。
               </Alert> */}
            </Col>
         </Row>

         <Row>
            <Col lg={7} md={8} sm={10} className="mx-auto">
               <Sunbirds/>
               {session && <LoggedInLinks/>}
            </Col>
         </Row>

         {!session && <Advert/>}

         <p className="text-white">{process.env.NEXT_PUBLIC_BASE_URL}</p>
      </Container>
   );
}

function LoggedInLinks() {
   return (
      <>
         <div className="d-flex flex-column gap-3 mt-3">
            <Link
               className="btn btn-lg btn-primary d-flex align-items-center justify-content-center"
               href="/questions"
            >
               <NotebookPen className="me-2"/>Questions
            </Link>

            <Link
               className="btn btn-lg btn-primary d-flex align-items-center justify-content-center"
               href="/cloze"
            >
               <FileText className="me-2"/>Cloze Passages
            </Link>

            <Link
               className="btn btn-lg btn-primary d-flex align-items-center justify-content-center"
               href="/mock_test"
            >
               <FlaskConical className="me-2"/>Mock Tests
            </Link>

            <Link
               className="btn btn-lg btn-success d-flex align-items-center justify-content-center"
               href="/profile"
            >
               <CircleUserRound className="me-2"/>Your Profile
            </Link>
         </div>
      </>
   )
}