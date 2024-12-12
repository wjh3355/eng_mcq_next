import checkNormalUserAuth from "@/serverFuncs/checkNormalUserAuth";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import fetchUserData from "@/serverFuncs/fetchUserData";
import { Suspense } from "react";
import StatsTable from "./StatsTable";

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
                  <Stats name={user.given_name!} />
               </Suspense>
            </Col>
         </Row>

      </Container>
   );
}

async function Stats({ name }: { name: string }) {

   let userData;
   try {
      userData = await fetchUserData(name);
   } catch (error) {
      return <p>Error loading user stats.</p>;
   }

   return <StatsTable userData={userData}/>;
         
}