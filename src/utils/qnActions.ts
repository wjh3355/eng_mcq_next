'use server';

import { connectToDB } from "@/utils/connectToDB";
import { QnCategory, MCQQnObj, QnObjSchema, QnObjArrSchema } from "@/types";

export async function fetchQn(
   collection: QnCategory | "demo", 
   qnNum: number
) {
   try {
      const { db } = await connectToDB("english_questions");
      const data = await db
         .collection(collection)
         .findOne({ qnNum }, { projection: { _id: 0 } });

      if (!data) throw new Error(`Cannot find Q${qnNum} from ${collection}`);

      const zodResult = QnObjSchema.safeParse(data);

      if (!zodResult.success) {
         console.error("Data not of correct type:", zodResult.error.issues);
         throw new Error("Type validation error");
      }

      return zodResult.data as MCQQnObj;

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error(`Unable to fetch ${collection} Q${qnNum} from database:`, error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
};

export async function fetchQnArr(
   collection: QnCategory, 
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

export async function fetchNumQns(collection: QnCategory) {
   try {
      const { db } = await connectToDB("english_questions");
      const numOfQns = await db
         .collection(collection)
         .countDocuments();

      return numOfQns;

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to fetch number of questions from database:", error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
}