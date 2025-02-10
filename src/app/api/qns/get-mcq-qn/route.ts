import { auth } from "@/auth";
import { qnCategoriesArrayTuple } from "@/definitions";
import client from "@/lib/mongodb/db";
import { QnObjSchema } from "@/lib/zod/zodSchemas";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const paramSchema = z.object({
   qnNum: z.string().regex(/^\d+$/).transform(val => Number(val)),
   category: z.enum(qnCategoriesArrayTuple)
})

export const GET = auth(
   
   async function GET(req) {
   
      try {

         if (!req.auth) {
            return NextResponse.json(
               { error: "Unauthorised" },
               { status: 403 }
            );
         }
   
         const paramZodRes = paramSchema.safeParse({
            qnNum: req.nextUrl.searchParams.get("qnNum"),
            category: req.nextUrl.searchParams.get("category")
         })
   
         if (!paramZodRes.success) {
            return NextResponse.json(
               { error: "Invalid params" },
               { status: 400 }
            );
         }
   
         const { category, qnNum } = paramZodRes.data;
   
         await client.connect();
         
         const mongoRes = await client
            .db("english_questions")
            .collection(category)
            .findOne({ qnNum }, { projection: { _id: 0 } })
   
         if (!mongoRes) {
            return NextResponse.json(
               { error: `Question cannot be found` },
               { status: 404 }
            );
         }
   
         const mongoZodRes = QnObjSchema.safeParse(mongoRes);
   
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
)


