"use server";

import client from "./db";
import { ClozeObjSchema } from "../zod/zodSchemas";
import { auth } from "@/auth";
import { z } from "zod";

export async function fetchCloze(qnNum: number) {
   try {
      const session = await auth();

      if (!session) throw new Error("Unauthorised");
      
      await client.connect();
      const res = await client
         .db("english_questions")
         .collection("clozePassage")
         .findOne({ qnNum }, { projection: { _id: 0 } })
      
      if (!res) throw new Error(`Cannot find cloze Q${qnNum}`)
      
      const zr = ClozeObjSchema.safeParse(res);

      if (!zr.success) throw new Error("Type validation failed: " + zr.error);

      return zr.data;

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to fetch cloze questions from database:\n" + error.message);
         return { error: error.message };
      } else {
         console.error("An unexpected error occured:", error);
         return { error: "Unexpected error occured" };
      }
   }
}

export async function fetchDemoCloze() {
   try {
      await client.connect();
      const res = await client
         .db("english_questions")
         .collection("clozePassage")
         .findOne({ qnNum: 1 }, { projection: { _id: 0 } })
      
      if (!res) throw new Error(`Cannot find demo cloze question`)
      
      const zr = ClozeObjSchema.safeParse(res);

      if (!zr.success) throw new Error("Type validation failed: " + zr.error);

      return zr.data;

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to fetch cloze questions from database:\n" + error.message);
         return { error: error.message };
      } else {
         console.error("An unexpected error occured:", error);
         return { error: "Unexpected error occured" };
      }
   }
}

export async function fetchAllCloze() {
   try {
      const session = await auth();

      if (!session) throw new Error("Unauthorised");
  
      await client.connect();
      
      const res = await client
         .db("english_questions")
         .collection("clozePassage")
         .find({}, { projection: { _id: 0 } })
         .toArray();
      
      const zr = z.array(ClozeObjSchema).safeParse(res);

      if (!zr.success) throw new Error("Type validation failed");

      return zr.data;

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to fetch all cloze questions from database:\n" + error.message);
         return { error: error.message };
      } else {
         console.error("An unexpected error occured:", error);
         return { error: "Unexpected error occured" };
      }
   }
}