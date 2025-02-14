"use server";

import { McqCategory } from "@/definitions";
import client from "./db";

export async function fetchNumQns(collection: McqCategory | "clozePassage" | "spelling") {
   try {

      // no need to check for auth; already done in the server

      await client.connect();
      const numOfQns = await client
         .db("english_questions")
         .collection(collection)
         .countDocuments();

      return numOfQns;

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to fetch number of questions from database:", error.message);
         return { error: error.message }
      } else {
         console.error("An unexpected error occured:", error);
         return { error: "Unexpected error occured" }
      }
   }
}