"use server";

import { connectToDB } from "@/lib/connectToDB";

export default async function updateUserStats({
   qnCategory,
   userName,
   qnNum,
   isCorrect
}: {
   qnCategory: string,
   userName: string,
   qnNum: number,
   isCorrect: boolean | null
}) {

   const incrementAndUpdateWrong = { 
      $inc: { [ qnCategory + ".numQnsAttempted" ]: 1 },
      $addToSet: { [ qnCategory + ".wrongQnNums" ]: qnNum }
   };

   const incrementOnly = { 
      $inc: { [ qnCategory + ".numQnsAttempted" ]: 1 }
   };

   try {
      const { db } = await connectToDB("userDatas");
      await db
         .collection("userQnData")
         .findOneAndUpdate(
            { name: userName },
            isCorrect === false ? incrementAndUpdateWrong : incrementOnly,
            { upsert: true }
         );

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