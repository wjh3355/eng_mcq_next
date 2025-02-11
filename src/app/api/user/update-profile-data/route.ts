import { qnCategoriesArrayTuple, QnCategory, UserProfileDocument } from "@/definitions";
import client from "@/lib/mongodb/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const reqSchema = z.object({
   email: z.string(),
   action: z.union([
      z.object({
         todo: z.literal("update mcq"),
         mcqCategory: z.enum(qnCategoriesArrayTuple),
         mcqCatQnNum: z.number(),
         isCorrect: z.boolean(),
      }),
      z.object({
         todo: z.literal("update cloze"),
         clozeQnNum: z.number(),
         correctAns: z.array(z.number()).nullable(),
      }),
      z.object({
         todo: z.literal("reset data")
      }),
   ])
})

export async function POST(req: NextRequest) {

   // Validate request body
   const zodRes = reqSchema.safeParse(await req.json());
   if (!zodRes.success) {
      return NextResponse.json(
         { error: "Invalid params" },
         { status: 400 }
      );
   }

   const { email, action } = zodRes.data;
      
   try {

      await client.connect();
      const profileDb = client.db("userDatas").collection<UserProfileDocument>("profile");
      
      // Check if user profile exists
      const dat = await profileDb.findOne({ email });
      if (!dat) {
         return NextResponse.json(
            { error: "No corresponding user profile" },
            { status: 500 }
         );
      }

      let mongoUpdateRes;

      // Update user profile data based on .todo
      switch (action.todo) {

         case "update mcq":
               
            const { mcqCategory, mcqCatQnNum, isCorrect } = action

            const updateQuery: any = { 
               $inc: { 
                  [ `qnData.${mcqCategory}.numQnsAttempted` ]: 1 
               } 
            };
      
            if (isCorrect === false) {
               updateQuery.$addToSet = { 
                  [ `qnData.${mcqCategory}.wrongQnNums` ]: mcqCatQnNum 
               }
            } else if (isCorrect === true) {
               updateQuery.$inc.score = 10
            };
      
            const setQuery = {
               $set: {
                  [`qnData.${mcqCategory}`]: {
                     numQnsAttempted: 1,
                     wrongQnNums: isCorrect ? [] : [mcqCatQnNum]
                  }
               },
               $inc: {
                  score: isCorrect ? 10 : 0
               }
            }
            
            if (dat.qnData[mcqCategory as QnCategory] === undefined) {
               mongoUpdateRes = await profileDb.updateOne({ email }, setQuery);
            } else {
               mongoUpdateRes = await profileDb.updateOne({ email }, updateQuery);
            }

            break;
         
         case "update cloze": 

            const { clozeQnNum, correctAns } = action

            if (correctAns) {
               mongoUpdateRes = await profileDb.updateOne({ email }, { $push: { clozeData: { qnNum: clozeQnNum, correctAns } } } );
            } else {
               mongoUpdateRes = await profileDb.updateOne( { email }, { $pull: { clozeData: { qnNum: clozeQnNum } } } );
            }

            break;
      
         case "reset data":

            mongoUpdateRes = await profileDb.updateOne(
               { email },
               {
                  $set: {
                     qnData: {},
                     clozeData: [],
                     score: 0,
                  },
               }
            );

            break;
         
         // no default case, action.todo already validated
      }

      if (mongoUpdateRes.acknowledged) {
         return NextResponse.json(
            { success: true },
            { status: 200 }
         );
      } else {
         return NextResponse.json(
            { error: `Unable to update user database` },
            { status: 500 }
         )
      }
      
   } catch (error) {
      return NextResponse.json(
         { error: `Unable to update user database: ${error}` },
         { status: 500 }
      )
   }
}
