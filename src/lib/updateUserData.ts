"use server";

import { connectToDB } from "@/lib/connectToDB";
import { CurrentQnCategories, createNewUserDate } from "@/types";

export default async function updateUserData({
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

   const updateQuery: any = { $inc: { [ `qnData.${cat}.numQnsAttempted` ]: 1 } };

   if (isCorrect === false) updateQuery.$addToSet = { [ `qnData.${cat}.wrongQnNums` ]: qnNum };

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