import SpellingApp from "@/components/spelling/SpellingApp";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import { fetchNumQns } from "@/lib/mongodb/shared-server-actions";
import { range, sampleSize, shuffle } from "lodash";
import { notFound } from "next/navigation";
import toast from "react-hot-toast";

const setSize = 50;

export const dynamicParams = false;

export async function generateStaticParams() {
      
   const totalNumQns = await fetchNumQns("spelling");
   if (typeof totalNumQns !== "number") return [];

   const numPossibleSets = Math.ceil(totalNumQns / setSize);

   const staticParams = range(1, numPossibleSets+1)
      .map(num => num.toString())
      .map(param => ({ setParam: param }));
   
   staticParams.push({ setParam: "random" });

   return staticParams;
}

export default async function SpellingSetsPage({ params }: { params: Promise<{ setParam: string }> }) {

   const user = await checkAuthForRoute();

   const { setParam } = await params;
   const setAsInteger = parseInt(setParam, 10);

   const totalNumQns = await fetchNumQns("spelling");
   if (typeof totalNumQns !== "number") {
      toast.error(totalNumQns.error);
      return;
   }
   
   const allQnNumsRange = range(1, totalNumQns + 1);

   const numPossibleSets = Math.ceil(totalNumQns / setSize);

   let qnNumArray: number[] = [];
   let title: string = "PSLE Spelling - "

   if (setAsInteger >= 1 && setAsInteger <= numPossibleSets) {
      qnNumArray = shuffle(
         allQnNumsRange.slice((setAsInteger - 1)*setSize, (
            setAsInteger*setSize <= totalNumQns 
               ?  setAsInteger*setSize
               :  totalNumQns
         ))
      );
      title += `Set ${setAsInteger}`;
   } else if (setParam === "random") {
      qnNumArray = sampleSize(allQnNumsRange, 50);
      title += "Random";
   } else {
      notFound();
   }

   return <SpellingApp
      email={user.email}
      qnNumArray={qnNumArray}
      title={title}
   />
}
