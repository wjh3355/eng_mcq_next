import { ClozeObj, QnCategory } from "@/definitions";
import client from "./db";
import { ClozeObjArrSchema } from "../zod/zodSchemas";

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