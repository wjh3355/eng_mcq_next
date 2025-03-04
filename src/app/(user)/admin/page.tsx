import { fetchAllUsers } from "@/lib/mongodb/user-server-actions";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import UsersTable from "../../../components/admin/UsersTable";
import Alert from "react-bootstrap/esm/Alert";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";

export default async function AdminHomePage() {

   const session = await auth();
   if (session?.user.role !== "admin") redirect("/");

   return (
      <Container fluid>

         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">All Users</h5>
            </Col>
         </Row>

         <Suspense fallback={<Skeleton height={50}/>}>
            <LoadAdmin/>
         </Suspense>
      </Container>
   );
}

async function LoadAdmin() {

   const allUsersArray = await fetchAllUsers();
   if ("error" in allUsersArray) return (
      <Container>
         <Row>
            <Col>
               <Alert variant="danger" className="fw-bold">{allUsersArray.error}</Alert>
            </Col>
         </Row>
      </Container>
   );

   return (
      <>
         <UsersTable allUsersArray={allUsersArray} />

         <Row className="my-3">
            <Col className="text-center">
               <Link href="/admin/unreg-users" className="btn btn-lg btn-success w-50">Unregistered Users</Link>
            </Col>
         </Row>
      </>
   )
}