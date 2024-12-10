"use server";

import { connectToDB } from "@/serverFuncs/connectToDB";
import { EMPTY_USER_CLOZE_DATA } from "@/types";

export default async function updateUserClozeData({
   userName,
   correctAns,
}: {
   userName: string,
   correctAns?: number[],
}) {

   try {
      const { db } = await connectToDB("userDatas");

      if (correctAns) {
         await db
            .collection("userQnData")
            .updateOne(
            { name: userName }, 
            {
               $set: { 
                  clozeData: {
                     hasDoneCloze: true,
                     correctAns
                  } 
               }
            }
         );
      } else {
         await db
            .collection("userQnData")
            .updateOne(
            { name: userName }, 
            {
               $set: { 
                  clozeData: EMPTY_USER_CLOZE_DATA
               }
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