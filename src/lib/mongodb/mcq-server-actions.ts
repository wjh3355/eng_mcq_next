"use server";

import { MCQQnObj, QnCategory } from "@/definitions";
import client from "./db";
import { McqObjSchema } from "../zod/zodSchemas";
import { auth } from "@/auth";
import { z } from "zod";

export async function fetchMcqQnArr(collection: QnCategory | 'demo', qnNums: number[]) {
   try {
      const session = await auth();

      if (!session) throw new Error("Unauthorised");
      
      await client.connect();
      
      const data = await client
         .db("english_questions")
         .collection(collection)
         .find({ qnNum: { $in: qnNums } }, { projection: { _id: 0 } })
         .toArray();

      if (data.length === 0) throw new Error("No questions found");

      const zr = z.array(McqObjSchema).safeParse(data);

      if (!zr.success) throw new Error("Type validation error");

      const inOriginalOrder: MCQQnObj[] = qnNums
         .map(num => zr.data.find(qn => qn.qnNum === num))
         .filter(ent => ent !== undefined);

      return inOriginalOrder;

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to fetch array of MCQ questions from database:\n" + error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
};

export async function fetchMcq(collection: QnCategory, qnNum: number) {
   try {
      const session = await auth();

      if (!session) throw new Error("Unauthorised");
     
      await client.connect();
      
      const res = await client
         .db("english_questions")
         .collection(collection)
         .findOne({ qnNum }, { projection: { _id: 0 } });

      if (!res) throw new Error(`Cannot find MCQ Q${qnNum} from ${collection}`);

      const zr = McqObjSchema.safeParse(res);

      if (!zr.success) throw new Error("Type validation failed: " + zr.error);

      return zr.data;

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to fetch MCQ question from database:\n" + error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
};

export async function fetchDemoMcq(qnNum: number) {
   try {     
      await client.connect();
      
      const res = await client
         .db("english_questions")
         .collection("demo")
         .findOne({ qnNum }, { projection: { _id: 0 } });

      if (!res) throw new Error(`Cannot find MCQ Q${qnNum} from demo`);

      const zr = McqObjSchema.safeParse(res);

      if (!zr.success) throw new Error("Type validation failed: " + zr.error);

      return zr.data;

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to fetch MCQ question from database:\n" + error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
};