'use server';

import { connectToDB } from "@/lib/connectToDB";
import { MongoCollectionNames, QnObjType } from "@/lib/types";
import { ZodError } from "zod";
import QnObjSchema from "@/lib/zod";

export async function fetchQnFromDB(
   collection: MongoCollectionNames, 
   qnNum: number
) {
   try {
      const { db } = await connectToDB("english_questions");
      const data = await db
         .collection(collection)
         .findOne({ qnNum }, { projection: { _id: 0 } });

      if (!data) throw new Error("Question not found");

      try {
         const validatedData = QnObjSchema.parse(data);
         return validatedData as QnObjType;
      } catch (error) {
         if (error instanceof ZodError) {
            console.error("Data not of correct type:", error.errors);
            throw new Error("Data validation error");
         }
         throw error;
      }

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