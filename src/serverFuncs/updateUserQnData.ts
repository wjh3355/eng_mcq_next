"use server";

import { connectToDB } from "@/serverFuncs/connectToDB";
import { CurrentQnCategories } from "@/types";

export default async function updateUserQnData({
   cat,
   userName,
   qnNum,
   isCorrect
}: {
   cat: CurrentQnCategories,
   userName: string,
   qnNum: number,
   isCorrect: boolean | null
}) {

   const updateQuery: any = { 
      $inc: { 
         [ `qnData.${cat}.numQnsAttempted` ]: 1 
      } 
   };

   if (isCorrect === false) {
      updateQuery.$addToSet = { 
         [ `qnData.${cat}.wrongQnNums` ]: qnNum 
      }
   } else if (isCorrect === true) {
      updateQuery.$inc.score = 10
   };

   const setQuery = {
      $set: {
         [`qnData.${cat}`]: {
            numQnsAttempted: 1,
            wrongQnNums: isCorrect ? [] : [qnNum]
         }
      }
   }

   try {
      const { db } = await connectToDB("userDatas");
      const userQnDataCollection = db.collection("userQnData");

      const dat = await userQnDataCollection.findOne({ name: userName });

      if (!dat) return;
      
      if (dat.qnData[cat] === undefined) {
         await userQnDataCollection.updateOne({ name: userName }, setQuery);
      } else {
         await userQnDataCollection.updateOne({ name: userName }, updateQuery);
      }

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to update user database:", error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
};