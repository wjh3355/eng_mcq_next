"use server";

import { auth } from "@/auth";
import { Question, Collections, UserProfileDocument } from "@/definitions";
import client from "./db";
import { QuestionSchema } from "../zod/NEWZODSCHEMA";
import { z } from "zod";

export async function fetchQuestion(collection: Collections, ...qnNum: number[]) {
   try {
      const session = await auth();

      if (!session) throw new Error("Unauthorised");
     
      await client.connect();
      
      const res = await client
         .db("questions")
         .collection(collection)
         .find({ qnNum: { $in: qnNum } }, { projection: { _id: 0 } })
         .toArray();
      
      if (!res) throw new Error(`Cannot find MCQ Q${qnNum} from ${collection}`);

      const zodRes = z.array(QuestionSchema).safeParse(res);

      if (!zodRes.success) throw new Error("Type error");

      return zodRes.data as Question[];

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to fetch MCQ question(s) from database: " + error.message);
         return { error: "Could not fetch MCQ question(s) from database due to: " + error.message }
      } else {
         console.error("Unexpected error occured while fetching MCQ question(s): ", error);
         return { error: "Unable to fetch MCQ questions. Try again later." }
      }
   }
};

export async function fetchNumOfQnsInCollection(collection: Collections) {
   try {

      await client.connect();
      const numOfQns = await client
         .db("questions")
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

export async function incrementUserScore(email: string) {
   try {

      const session = await auth();
      if (!session) throw new Error("Unauthorized");

      await client.connect();
      const profileDb = client.db("userDatas").collection<UserProfileDocument>("profile");
      const profile = await profileDb.findOne({ email })
      if (!profile) throw new Error(`User profile for ${email} not found`);

      await profileDb.updateOne({ email }, { $inc: { score: 10 } });

      return { success: true };

   } catch (error) {
      if (error instanceof Error) {
         console.error(`Unable to update user profile for ${email}: ` + error.message);
         return { error: "Could not update user profile due to: " + error.message }
      } else {
         console.error(`Unexpected error occured while updating user profile for ${email}: ` + error);
         return { error: `Unable to update user profile for ${email}. Try again later.` }
      }
   }
}