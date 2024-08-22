'use server';

import { connectToDB } from "@/lib/connectToDB";
import { QnObjType } from "./types";

export async function fetchQnFromDB(collection: string, qnNum: number) {
   try {
      const { db } = await connectToDB("english_questions");
      const qn = await db
         .collection(collection)
         .findOne({ qnNum }, { projection: { _id: 0 } });

      if (!qn) throw new Error("Question not found");

      return qn as any as QnObjType;

   } catch (error: unknown) {

      if (error instanceof Error) {
         console.error("Unable to fetch question from database:", error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
}