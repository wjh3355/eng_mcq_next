import { MTDataType } from "@/definitions";
import { MTDataSchema } from "../zod/NEWZODSCHEMA";
import client from "./db";

export async function fetchMockTestData(num: number) {
   try {
   
      await client.connect();
      
      const res = await client
         .db("mockTests")
         .collection("mockTestRandomNums")
         .findOne({ mockTestNumber: num }, { projection: { _id: 0 } })
      
      const zr = MTDataSchema.safeParse(res);

      if (!zr.success) throw new Error("Type validation failed");
      
      return zr.data as MTDataType;

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to fetch all mock test question combinations from database:\n" + error.message);
         return { error: error.message };
      } else {
         console.error("An unexpected error occured:", error);
         return { error: "Unexpected error occured" };
      }
   }
}

export async function fetchNumMockTests() {
   try {
  
      await client.connect();
      
      const res = await client
         .db("mockTests")
         .collection("mockTestRandomNums")
         .countDocuments();
      
      return res;

   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error("Unable to fetch all mock test question combinations from database:\n" + error.message);
         return { error: error.message };
      } else {
         console.error("An unexpected error occured:", error);
         return { error: "Unexpected error occured" };
      }
   }
}