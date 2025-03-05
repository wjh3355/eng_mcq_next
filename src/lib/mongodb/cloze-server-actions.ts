"use server";

import client from "./db";
import { ClozeSchema } from "../zod/zodSchemas";
import { auth } from "@/auth";
import { z } from "zod";
import { Cloze } from "@/definitions";

export async function fetchCloze(qnNum: number) {
   try {

      // qn 1 is the demo question, no need to authenticate
      if (qnNum !== 1) {
         const session = await auth();
         if (!session) throw new Error("Unauthorised");
      }
      
      await client.connect();
      const res = await client
         .db("clozes")
         .collection("clozes")
         .findOne({ qnNum }, { projection: { _id: 0 } })
      
      if (!res) throw new Error(`Cannot find cloze Q${qnNum}`)
      
      const zr = ClozeSchema.safeParse(res);

      if (!zr.success) throw new Error("Type validation failed: " + zr.error);

      return zr.data as Cloze;

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
         .db("clozes")
         .collection("clozes")
         .find({}, { projection: { _id: 0 } })
         .toArray();
      
      const zr = z.array(ClozeSchema).safeParse(res);

      if (!zr.success) throw new Error("Type validation failed");

      return zr.data as Cloze[];

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

export async function fetchNumClozes() {
   try {
  
      await client.connect();
      
      const res = await client
         .db("clozes")
         .collection("clozes")
         .countDocuments();
      
      return res;

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to fetch num of cloze questions from database:\n" + error.message);
         return { error: error.message };
      } else {
         console.error("An unexpected error occured:", error);
         return { error: "Unexpected error occured" };
      }
   }
}