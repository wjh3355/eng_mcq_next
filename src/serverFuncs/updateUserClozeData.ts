"use server";

import { connectToDB } from "@/serverFuncs/connectToDB";
import { UserData } from "@/types";

export default async function updateUserClozeData({
   userName,
   qnNum,
   correctAns,
}: {
   userName: string,
   qnNum: number
   correctAns?: number[],
}) {

   try {
      const { db } = await connectToDB("userDatas");
      const userCollection = db.collection<UserData>("userQnData");

      if (correctAns) {
         await userCollection
            .updateOne(
               { name: userName }, 
               {
                  $push: { clozeData: { qnNum, correctAns } }
               }
            );
      } else {
         await userCollection
            .updateOne(
               { name: userName }, 
               {
                  $pull: { clozeData: { qnNum } }
               }
            );
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