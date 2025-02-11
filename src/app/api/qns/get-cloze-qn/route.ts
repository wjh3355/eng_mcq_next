import client from "@/lib/mongodb/db";
import { ClozeObjSchema } from "@/lib/zod/zodSchemas";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
   
   // TODO: stupid auth() wrapper isnt working. 
   // Works fine in development but TS is bitching about it in production for some reason
   // FIX IN THE FUTURE!
   // all the other routes also have this same fucking issue
   // our questions can be seen by anyone!

   // if (!req.auth) {
   //    return NextResponse.json(
   //       { error: "Unauthorised" },
   //       { status: 403 }
   //    );
   // }

   // check params: qnNum should be an integer
   const paramZodRes = z
      .string()
      .regex(/^\d+$/)
      .transform(val => Number(val))
      .safeParse(req.nextUrl.searchParams.get("qnNum"));

   if (!paramZodRes.success) {            
      return NextResponse.json(
         { error: "Invalid params" },
         { status: 400 }
      );
   }

   const qnNum = paramZodRes.data;

   try {

      await client.connect();

      // fetch question from db
      const mongoRes = await client
         .db("english_questions")
         .collection("clozePassage")
         .findOne({ qnNum }, { projection: { _id: 0 } })
      
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
