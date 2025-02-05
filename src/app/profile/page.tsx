import Row from "react-bootstrap/Row";
import { Suspense } from "react";
import ProfileTable from "../../components/ProfileTable";
import Skeleton from "react-loading-skeleton";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import { UserProfileDocument } from "@/definitions";
import Container from "react-bootstrap/esm/Container";

export const dynamic = 'force-dynamic';

export default async function Page() {

   const user = await checkAuthForRoute();
   
   return (
      <Container>
         <Row className="my-3">
            <h5 className="text-center m-0">Your Profile</h5>
         </Row>
         <Suspense fallback={<Skeleton height={40}/>}>
            <Stats user={user} />
         </Suspense>
      </Container>
   );
}

async function Stats({ user }: { user: UserProfileDocument }) {
   return <ProfileTable user={user}/>; 
}