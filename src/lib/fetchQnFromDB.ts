'use server';

import { connectToDB } from "@/lib/connectToDB";
import { QnObjType } from "./types";
import { AllowedQuestionCategories } from "./types";

export async function fetchQnFromDB(
   collection: AllowedQuestionCategories, 
   qnNum: number
) {
   try {
      const { db } = await connectToDB("english_questions");
      const data = await db
         .collection(collection)
         .findOne({ qnNum }, { projection: { _id: 0 } });

      if (!data) throw new Error("Question not found");

      if (!isQuestionType(data)) throw new Error("Unable to display question");

      return data;

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

function isQuestionType(data: any): data is QnObjType {
   return typeof data === 'object'
      && data !== null
      && typeof data.qnNum === 'number'
      && typeof data.sentence === 'string'
      && typeof data.correctAns === 'string'
};