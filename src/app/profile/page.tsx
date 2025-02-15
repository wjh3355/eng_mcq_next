import Row from "react-bootstrap/Row";
import fetchUserData from "@/utils/fetchUserData";
import { Suspense } from "react";
import UserStatsTable from "../../components/UserStatsTable";
import Skeleton from "react-loading-skeleton";
import getUserDataHeaders from "@/utils/getUserDataHeaders";
import { HeaderUserDetails } from "@/types";

export const dynamic = 'force-dynamic';

export default async function Page() {

   const user = await getUserDataHeaders();
   
   return (
      <>
         <Row className="my-3">
            <h5 className="text-center m-0">Your Profile</h5>
         </Row>
         <Suspense fallback={<Skeleton height={40}/>}>
            <Stats kindeUser={user} />
         </Suspense>
      </>
   );
}

async function Stats({ kindeUser }: { kindeUser: HeaderUserDetails }) {
   const userData = await fetchUserData(kindeUser.kindeUserGivenName);
   return <UserStatsTable mongoUserData={userData} kindeUserData={kindeUser}/>; 
}