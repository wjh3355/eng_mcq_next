'use server';

import { connectToDB } from "@/serverFuncs/connectToDB";
import { CurrentQnCategories, MCQQnObj, QnObjSchema, QnObjArrSchema } from "@/types";

export async function fetchQn(
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

export async function fetchQnArr(
   collection: CurrentQnCategories, 
   qnNums: number[]
) {
   try {
      const { db } = await connectToDB("english_questions");
      const data = await db
         .collection(collection)
         .find({ qnNum: { $in: qnNums } }, { projection: { _id: 0 } })
         .toArray();

      if (data.length === 0) throw new Error("Questions not found");

      const zodResult = QnObjArrSchema.safeParse(data);

      if (!zodResult.success) {
         console.error("Data not of correct type:", zodResult.error.issues);
         throw new Error("Type validation error");
      }

      const qnObjArrInOriginalOrder: MCQQnObj[] = qnNums
         .map(num => zodResult.data.find(qn => qn.qnNum === num))
         .filter(ent => ent !== undefined);

      return qnObjArrInOriginalOrder;

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