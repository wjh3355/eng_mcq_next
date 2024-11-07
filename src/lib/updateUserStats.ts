"use server";

import { connectToDB } from "@/lib/connectToDB";
import { CurrentQnCategories, createNewUserDate } from "@/types";

export default async function updateUserStats({
   qnCategory,
   userName,
   qnNum,
   isCorrect
}: {
   qnCategory: CurrentQnCategories,
   userName: string,
   qnNum: number,
   isCorrect: boolean | null
}) {

   const incrementAndUpdateWrong = { 
      $inc: { [ `qnData.${qnCategory}.numQnsAttempted` ]: 1 },
      $addToSet: { [ `qnData.${qnCategory}.wrongQnNums` ]: qnNum }
   };

   const incrementOnly = { 
      $inc: { [ `qnData.${qnCategory}.numQnsAttempted` ]: 1 }
   };

   try {
      const { db } = await connectToDB("userDatas");
      const userQnDataCollection = db.collection("userQnData");

      const userStatsDoc = await userQnDataCollection.findOne({ name: userName });

      if (!userStatsDoc) await userQnDataCollection.insertOne(createNewUserDate(userName));

      await userQnDataCollection.findOneAndUpdate(
         { name: userName },
         isCorrect === false ? incrementAndUpdateWrong : incrementOnly,
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