"use server";

import { EMPTY_USER_CLOZE_DATA } from "@/types";
import { connectToDB } from "./connectToDB";

export default async function eraseUserData(name: string) {
   try {
      const { db } = await connectToDB("userDatas");
      await db.collection("userQnData").updateOne(
         { name },
         {
            $set: {
               qnData: {},
               score: 0,
               clozeData: EMPTY_USER_CLOZE_DATA
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

} 