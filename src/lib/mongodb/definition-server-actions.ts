"use server";

import { auth } from "@/auth";
import { DefinitionObjSchema } from "../zod/zodSchemas";
import client from "./db";

export async function fetchDefinition(qnNum: number) {

   try {
      // check if user is authenticated
      // if not, throw an error
      const session = await auth();
      if (!session) throw new Error("Unauthorised");
     
      // connect to database and fetch question
      // if question is not found, throw an error
      await client.connect();
      const res = await client
         .db("english_questions")
         .collection("definition")
         .findOne({ qnNum }, { projection: { _id: 0 } });
      if (!res) throw new Error(`Cannot find definition Q${qnNum}`);

      // validate the response
      const zr = DefinitionObjSchema.safeParse(res);
      if (!zr.success) throw new Error("Type validation failed: " + zr.error);

      // return the data (will be of type DefinitionQnObj)
      return zr.data;

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to fetch definition question from database:\n" + error.message);
         return { error: error.message }
      } else {
         console.error("An unexpected error occured:", error);
         return { error: "Unexpected error occured" }
      }
   }
};