import { ClozeObj, MCQQnObj, QnCategory } from "@/definitions";
import client from "./db";
import { ClozeObjArrSchema, McqObjArrSchema } from "../zod/zodSchemas";

export async function fetchNumQns(collection: QnCategory | "clozePassage"): Promise<number> {
   try {
      await client.connect();
      const numOfQns = await client
         .db("english_questions")
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

export async function fetchAllCloze(): Promise<ClozeObj[]> {
   try {
      await client.connect();
      const res = await client
         .db("english_questions")
         .collection("clozePassage")
         .find({}, { projection: { _id: 0 } })
         .toArray();
      
      const zodRes = ClozeObjArrSchema.safeParse(res);

      if (!zodRes.success) throw new Error("Type validation failed");

      return zodRes.data;

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to all cloze questions from database:", error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
}

export async function fetchMcqQnArr(
   collection: QnCategory, 
   qnNums: number[]
) {
   try {
      await client.connect();
      
      const data = await client
         .db("english_questions")
         .collection(collection)
         .find({ qnNum: { $in: qnNums } }, { projection: { _id: 0 } })
         .toArray();

      if (data.length === 0) throw new Error("Questions not found");

      const zodResult = McqObjArrSchema.safeParse(data);

      if (!zodResult.success) throw new Error("Type validation error");

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