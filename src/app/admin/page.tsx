import { QnCategory, QnCategoryUserData, QN_CATEGORIES_DATA } from "@/definitions";
import { fetchAllUsers } from "@/lib/mongodb/user-server-actions";
import { DateTime } from "luxon";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Table from "react-bootstrap/esm/Table";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "react-bootstrap/esm/Button";
import UsersTable from "./UsersTable";

export default async function AdminHomePage() {

   const session = await auth();
   if (session?.user.role !== "admin") redirect("/");

   const allUsersArray = await fetchAllUsers();

   return (
      <Container fluid>

         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">All Users</h5>
            </Col>
         </Row>

         <UsersTable allUsersArray={allUsersArray} />

         <Row className="my-3">
            <Col className="text-center">
               <Link href="/admin/unreg-users" className="btn btn-lg btn-success w-50">Unregistered Users</Link>
            </Col>
         </Row>
      </Container>
   );
}