import DefinitionApp from "@/components/definition/DefinitionApp";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import { fetchNumQns } from "@/lib/mongodb/shared-server-actions";
import { range, shuffle } from "lodash";
import React from "react";
import toast from "react-hot-toast";

export default async function DefinitionsSetsPage() {

   const user = await checkAuthForRoute();

   const totalNumQns = await fetchNumQns("definition");
   if (typeof totalNumQns !== "number") {
      toast.error(totalNumQns.error);
      return;
   }
   const qnNumArray = shuffle(range(1, totalNumQns+1));

   return <DefinitionApp
      email={user.email}
      qnNumArray={qnNumArray}
      title="Definitions - Set X"
   />
}
