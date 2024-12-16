'use server';

import { connectToDB } from "@/serverFuncs/connectToDB";
import { ClozeObj } from "@/types";

export default async function fetchClozeFromDB(num: number) {
   try {
      const { db } = await connectToDB("english_questions");
      const data = await db
         .collection("clozePassage")
         .findOne({ qnNum: num }, { projection: { _id: 0 } });
      
      if (!data) throw new Error("Question not found");

      return data as unknown as ClozeObj;

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to fetch question from database:", error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
};