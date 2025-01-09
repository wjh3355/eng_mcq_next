'use server';

import { connectToDB } from "@/utils/connectToDB";
import { ClozeObj, ClozeObjArrSchema, ClozeObjSchema } from "@/types";

export async function fetchCloze(num: number) {
   try {
      const { db } = await connectToDB("english_questions");
      const data = await db
         .collection("clozePassage")
         .findOne({ qnNum: num }, { projection: { _id: 0 } });
      
      if (!data) throw new Error(`Cannot find cloze Q${num}`);

      const zodResult = ClozeObjSchema.safeParse(data);

      if (!zodResult.success) throw new Error("Type validation error");

      return zodResult.data as ClozeObj;

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

export async function fetchAllClozeArr() {
   try {
      const { db } = await connectToDB("english_questions");
      const data = await db
         .collection("clozePassage")
         .find({}, { projection: { _id: 0 } })
         .toArray();
      
      if (!data) throw new Error("Question not found");

      const zodResult = ClozeObjArrSchema.safeParse(data);

      if (!zodResult.success) throw new Error("Type validation error");

      return zodResult.data.sort((a, b) => a.qnNum - b.qnNum) as ClozeObj[];

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

export async function fetchNumClozes() {
   try {
      const { db } = await connectToDB("english_questions");
      const numClozes = await db
         .collection("clozePassage")
         .countDocuments();

      return numClozes;

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to fetch number of cloze passages from database:", error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
}