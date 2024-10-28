import checkUserAuth from "@/lib/checkUserAuth";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import fetchUserStats from "@/lib/fetchUserStats";
import { Suspense } from "react";
import Link from "next/link";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { QN_CATEGORIES_DATA, CurrentQnCategories } from "@/types";

export default async function Page() {

   const user = await checkUserAuth();
   
   return (
      <Container>
         <Row className="my-3">
            <h5 className="text-center m-0">Your Profile</h5>
         </Row>

         <Suspense fallback={<Row><Col><p>Loading your profile...</p></Col></Row>}>
            <UserProfile user={user}/>
         </Suspense>

      </Container>
   );
}

async function UserProfile({ user }: { user: KindeUser<Record<string, any>> }) {

   return (
      <>
         <Row>
            <Col>
               <p>
                  <strong>Username: </strong>
                  {user.given_name}
               </p>
               <p>
                  <strong>Email address: </strong>
                  {user.email}
               </p>
            </Col>
         </Row>

         <Row>
            <Col>
               <Suspense fallback={<p>Loading your data...</p>}>
                  <UserStatsTable name={user.given_name!} />
               </Suspense>
            </Col>
         </Row>
      </>
   );
}

async function UserStatsTable({ name }: { name: string }) {

   let userData;
   try {
      userData = await fetchUserStats(name);
   } catch (error) {
      return <p>Error loading user stats.</p>;
   }

   return (
      <Container style={{ overflowX: "auto" }}>
         <Table striped>
            <thead>
               <tr>
                  <th>Question Category</th>
                  <th>No. Attempted</th>
                  <th>No. Incorrect</th>
                  <th>Incorrect Questions</th>
               </tr>
            </thead>
            <tbody>
               {(
                  Object.entries(userData) as [
                     CurrentQnCategories,
                     { numQnsAttempted: number; wrongQnNums: number[] }
                  ][]
               ).map(([cat, dat]) => (
                  <tr key={cat}>
                     <td>{QN_CATEGORIES_DATA[cat].name}</td>
                     <td>{dat.numQnsAttempted}</td>
                     <td>{dat.wrongQnNums.length}</td>
                     <td>
                        <Link 
                           href={`/profile/${cat}`}
                        >
                           View
                        </Link>
                     </td>
                  </tr>
               ))}
            </tbody>
         </Table>
      </Container>
   );
}