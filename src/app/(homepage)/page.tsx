import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { CircleUserRound, FileText, NotebookPen } from "lucide-react";
import ensureUserDataDocExists from "@/serverFuncs/ensureUserDataDocExists";
import Sunbirds from "../ui/components/Sunbirds";
import Advert from "./Advert";

export const revalidate = 3600;

export default async function Page() {
   const { getUser } = getKindeServerSession();
   const user = await getUser();

   if (user) await ensureUserDataDocExists(user.given_name!);

   return (
      <>
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">Revise for the PSLE English Paper</h5>
            </Col>
         </Row>

         <Row>
            <Col lg={7} md={8} sm={10} className="mx-auto">
               <Sunbirds/>
               {user && <LoggedInLinks/>}
            </Col>
         </Row>

         {!user && <Advert/>}

      </>
   );
}

function LoggedInLinks() {
   return (
      <>
         <div className="d-flex flex-column gap-3 mt-3">
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
               <FileText className="me-2"/>Cloze Passages
            </Link>

            <Link
               className="btn btn-lg btn-success d-flex align-items-center justify-content-center"
               href="/profile"
            >
               <CircleUserRound className="me-2"/>Your Profile
            </Link>
         </div>

         <h4 className="text-center mt-4 text-danger fw-bold">🎉✨ Sunbird English wishes all users a happy 2025 🎉✨</h4>

         <p className="text-center mt-3">Note: this website URL has moved permanently from <strong>eng-mcq-next.vercel.app</strong> to <strong>sunbirdenglish.com</strong>. If you are still using the old URL, you will be automatically redirected to the new one.</p>
      </>
   )
}