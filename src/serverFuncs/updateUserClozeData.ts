"use server";

import { connectToDB } from "@/serverFuncs/connectToDB";

export default async function updateUserClozeData({
   userName,
   score,
}: {
   userName: string,
   score: number,
}) {

   try {
      const { db } = await connectToDB("userDatas");
      
      await db
         .collection("userQnData")
         .updateOne(
         { name: userName }, 
         {
            $set: { 
               clozeData: {
                  hasDoneCloze: true,
                  score
               } 
            }
         }
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