import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import { fetchUser } from "@/lib/mongodb/user-server-actions";
import React from "react";

export default async function UserJsonPage_Hidden() {

   const userProfile = await checkAuthForRoute();
   const userAuth = await fetchUser(userProfile.email, "auth");

   return (
      <div>
         <pre style={{ fontSize: "7px" }}>
            {JSON.stringify(userAuth, null, 3)}
         </pre>
         <br/><br/><br/><br/><br/><br/>
         <pre style={{ fontSize: "7px" }}>
            {JSON.stringify(userProfile, null, 3)}
         </pre>
      </div>
   );
}
