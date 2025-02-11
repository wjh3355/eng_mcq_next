import client from "@/lib/mongodb/db";
import { McqObjSchema } from "@/lib/zod/zodSchemas";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {

   try {

      const paramZodRes = z
         .string()
         .regex(/^\d+$/)
         .transform(val => Number(val))
         .safeParse(req.nextUrl.searchParams.get("qnNum"))

      if (!paramZodRes.success) {
         return NextResponse.json(
            { error: "Invalid params" },
            { status: 400 }
         );
      }

      const qnNum = paramZodRes.data;

      await client.connect();
      
      const mongoRes = await client
         .db("english_questions")
         .collection("demo")
         .findOne({ qnNum }, { projection: { _id: 0 } })

      if (!mongoRes) {
         return NextResponse.json(
            { error: `Question cannot be found` },
            { status: 404 }
         );
      }

      const mongoZodRes = McqObjSchema.safeParse(mongoRes);

      if (!mongoZodRes.success) {
         return NextResponse.json(
            { error: "Type validation error" },
            { status: 500 }
         );
      }

      const qnObj = mongoZodRes.data;
      
      return NextResponse.json({ qnObj }, { status: 200 });

   } catch (error) {
      return NextResponse.json(
         { error: "Error while fetching questions" },
         { status: 500 }
      );
   }
}

