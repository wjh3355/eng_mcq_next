'use server';

import { connectToDB } from "@/serverFuncs/connectToDB";
import { CurrentQnCategories, MCQQnObj, QnObjArrSchema } from "@/types";

export default async function fetchGrammarCatFromDB(grammarCategory: string) {
   try {
      const { db } = await connectToDB("english_questions");
      const data = await db
         .collection("psleGrammar")
         .find({ type: grammarCategory }, { projection: { _id: 0 } })
         .toArray();
      
      const data2 = data as unknown as MCQQnObj[];

      return data2.map(dat => dat.qnNum);

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