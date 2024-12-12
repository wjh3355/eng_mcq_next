import checkNormalUserAuth from "@/serverFuncs/checkNormalUserAuth";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import fetchUserData from "@/serverFuncs/fetchUserData";
import { Suspense } from "react";
import StatsTable from "./StatsTable";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import Skeleton from "react-loading-skeleton";

export const dynamic = 'force-dynamic';

export default async function Page() {

   const user = await checkNormalUserAuth();
   
   return (
      <Container className="mb-4">
         <Row className="my-3">
            <h5 className="text-center m-0">Your Profile</h5>
         </Row>

         <Suspense fallback={<Skeleton height={40}/>}>
            <Stats kindeUser={user} />
         </Suspense>

      </Container>
   );
}

async function Stats({ kindeUser }: { kindeUser: KindeUser<Record<string, any>> }) {

   let userData;
   try {
      userData = await fetchUserData(kindeUser.given_name!);
   } catch (error) {
      return <p>Error loading user stats.</p>;
   }

   return <StatsTable userData={userData} kindeUser={kindeUser}/>;
         
}