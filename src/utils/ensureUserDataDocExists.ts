"use server";

import { connectToDB } from "@/utils/connectToDB";
import { makeNewUserDoc } from "@/types";

export default async function ensureUserDataDocExists(name: string) {

   if (typeof name !== "string" || name.length === 0) return;

   try {
      const { db } = await connectToDB("userDatas");
      const userQnDataCollection = db.collection("userQnData");

      await userQnDataCollection.updateOne(
         { name },
         { $setOnInsert: makeNewUserDoc(name) },
         { upsert: true }
      );

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to create/check new user document:", error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
}