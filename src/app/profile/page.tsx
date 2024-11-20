import checkNormalUserAuth from "@/lib/checkNormalUserAuth";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import fetchUserData from "@/lib/fetchUserData";
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
      userData = await fetchUserData(name);
   } catch (error) {
      return <p>Error loading user stats.</p>;
   }

   return (
      <>
         <p>
            <strong>Date created: </strong>
            {userData.dateCreated.toDateString()}
         </p>
         {
            JSON.stringify(userData.qnData) === "{}" 

               ? <p><strong className="text-danger">You have not done any questions yet!</strong></p>

               : <section style={{ overflowX: "auto" }} >
                  <Table striped>
                     <thead>
                        <tr>
                           <th>Category</th>
                           <th>No. Done</th>
                           <th>No. Incorrect</th>
                           <th></th>
                        </tr>
                     </thead>
                     <tbody>
                        {
                           (Object.entries(userData.qnData) as [
                              CurrentQnCategoriesTracked,
                              { numQnsAttempted: number; wrongQnNums: number[] }
                           ][]).map(([cat, {numQnsAttempted, wrongQnNums}]) => 
                           <tr key={cat} >
                              <td>{QN_CATEGORIES_DATA[cat].name}</td>
                              <td>{numQnsAttempted}</td>
                              {wrongQnNums.length === 0
                                 ? <><td>0</td><td></td></>
                                 : <>
                                    <td>
                                       {wrongQnNums.length}&nbsp;
                                       <Link href={`/profile/${cat}`}>
                                          (View)
                                       </Link>
                                    </td>
                                    <td>
                                       <Link 
                                          href={`/redoWrong/${cat}`}
                                          className="btn btn-warning btn-sm"
                                       >
                                          <strong>Redo</strong>
                                       </Link>
                                    </td>
                                 </>
                              }
                           </tr>)
                        }
                     </tbody>
                  </Table>
               </section>
         }
      </>
   );
}