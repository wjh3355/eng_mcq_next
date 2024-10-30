'use server';

import { connectToDB } from "@/lib/connectToDB";
import { QnObj, QnObjArrSchema } from "@/types";

export default async function fetchQnArrFromDB(
   collection: string, 
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

      const qnObjArrInOriginalOrder: QnObj[] = qnNums
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