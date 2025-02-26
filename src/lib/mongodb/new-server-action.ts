import { auth } from "@/auth";
import { Question, QuestionCategories } from "@/definitions";
import client from "./db";

export async function fetchQuestion(collection: QuestionCategories, qnNum: number) {
   try {
      const session = await auth();

      if (!session) throw new Error("Unauthorised");
     
      await client.connect();
      
      const res = await client
         .db("english_questions")
         .collection(collection)
         .findOne({ qnNum }, { projection: { _id: 0 } });

      if (!res) throw new Error(`Cannot find MCQ Q${qnNum} from ${collection}`);

      return res as unknown as Question;

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