import checkNormalUserAuth from "@/lib/checkNormalUserAuth";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import fetchUserStats from "@/lib/fetchUserStats";
import { Suspense } from "react";
import Link from "next/link";
import { QN_CATEGORIES_DATA, CurrentQnCategoriesTracked } from "@/types";

export const dynamic = 'force-dynamic';

export default async function Page() {

   const user = await checkNormalUserAuth();
   
   return (
      <Container className="mb-4">
         <Row className="my-3">
            <h5 className="text-center m-0">Your Profile</h5>
         </Row>

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
               <Suspense fallback={<p>Fetching data...</p>}>
                  <UserStatsTable name={user.given_name!} />
               </Suspense>
            </Col>
         </Row>

      </Container>
   );
}

async function UserStatsTable({ name }: { name: string }) {

   let userData;
   try {
      userData = await fetchUserStats(name);
   } catch (error) {
      return <p>Error loading user stats. If you have not done any questions yet, attempting one will create your user profile.</p>;
   }

   return (
      <>
         <p>
            <strong>Date created: </strong>
            {userData.dateCreated.toDateString()}
         </p>
         <section style={{ overflowX: "auto" }}>
            <Table striped>
               <thead>
                  <tr>
                     <th>Category</th>
                     <th>No. Attempted</th>
                     <th>No. Incorrect</th>
                     <th>Incorrect Questions</th>
                  </tr>
               </thead>
               <tbody>
                  {(
                     Object.entries(userData.qnData) as [
                        CurrentQnCategoriesTracked,
                        { numQnsAttempted: number; wrongQnNums: number[] }
                     ][]
                  ).map(([cat, dat]) => {
                     if (dat.numQnsAttempted > 0) return <tr key={cat}>
                        <td>{QN_CATEGORIES_DATA[cat].name}</td>
                        <td>{dat.numQnsAttempted}</td>
                        <td>{dat.wrongQnNums.length}</td>
                        <td>
                           <Link href={`/profile/${cat}`}>
                              View
                           </Link>
                        </td>
                     </tr>
                  })}
               </tbody>
            </Table>
         </section>
      </>
   );
}