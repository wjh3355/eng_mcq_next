import client from "@/lib/mongodb/db";
import { ClozeObjSchema } from "@/lib/zod/zodSchemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

   try {

      await client.connect();

      const mongoRes = await client
         .db("english_questions")
         .collection("clozePassage")
         .findOne({ qnNum: 1 }, { projection: { _id: 0 } })
      
      if (!mongoRes) {
         return NextResponse.json(
            { error: "Question cannot be found" },
            { status: 404 }
         );
      }

      const mongoZodRes = ClozeObjSchema.safeParse(mongoRes);
      
      if (!mongoZodRes.success) {
         return NextResponse.json(
            { error: "Type validation error" },
            { status: 500 }
         );

      }
      
      const clozeObj = mongoZodRes.data;

      return NextResponse.json({ clozeObj }, { status: 200 });

   } catch (error) {
      return NextResponse.json(
         { error: "Error while fetching questions" },
         { status: 500 }
      );
   }
}