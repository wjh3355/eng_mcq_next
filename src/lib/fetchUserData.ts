"use server";

import { connectToDB } from "./connectToDB";
// import { UserDataSchema } from "../types/zodSchemas";
import { UserData } from "@/types";

export default async function fetchUserData(name: string) {
   const { db } = await connectToDB("userDatas");
   const data = await db.collection("userQnData").findOne(
      { name },
      { projection: { _id: 0 } }
   );

   if (!data) throw new Error("User data not found");
   // const zodResult = UserDataSchema.safeParse(data);
   // if (!zodResult.success) {
   //    console.error("Data not of correct type:", zodResult.error.issues);
   //    throw new Error("Type validation error");
   // }
   return data as unknown as UserData;
} 