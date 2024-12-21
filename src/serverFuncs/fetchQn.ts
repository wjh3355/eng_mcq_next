'use server';

import { connectToDB } from "@/serverFuncs/connectToDB";
import { CurrentQnCategories, MCQQnObj, QnObjSchema } from "@/types";

export default async function fetchQn(
   collection: CurrentQnCategories, 
   qnNum: number
) {
   try {
      const { db } = await connectToDB("english_questions");
      const data = await db
         .collection(collection)
         .findOne({ qnNum }, { projection: { _id: 0 } });

      if (!data) throw new Error("Question not found");

      const zodResult = QnObjSchema.safeParse(data);

      if (!zodResult.success) {
         console.error("Data not of correct type:", zodResult.error.issues);
         throw new Error("Type validation error");
      }

      return zodResult.data as MCQQnObj;

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