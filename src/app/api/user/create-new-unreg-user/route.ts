import { auth } from "@/auth";
import { newUserInvite, UserAuthDocument, UserInviteDocument } from "@/definitions";
import client from "@/lib/mongodb/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const POST = auth(
   
   async function POST(req) {
   
      try {

         if (req.auth?.user.role !== "admin") {
            return NextResponse.json(
               { error: "Unauthorised" },
               { status: 403 }
            );
         }
   
         const validationRes = z.object({ email: z.string() }).safeParse(await req.json());
         // check params
         if (!validationRes.success) {
            return NextResponse.json(
               { error: "Invalid email" },
               { status: 400 }
            );
         }
         
         const { email } = validationRes.data;
         await client.connect();
         const db = client.db("userDatas");
   
         // check email provided is not already associated with registered user / invite
         const existingUser = await db.collection("auth").findOne({ email }, { projection: { _id: 0 } }) as unknown as UserAuthDocument | null;
         const existingInvite = await db.collection("unregistered").findOne({ email }, { projection: { _id: 0 } }) as unknown as UserInviteDocument | null;
         if (existingUser) {
            return NextResponse.json(
               { error: "User already fully registered" },
               { status: 500 }
            )
         } else if (existingInvite) {
            return NextResponse.json(
               { error: `User already has pending invite with token ${existingInvite.token}, created on ${existingInvite.dateCreated}` },
               { status: 500 }
            )
         }
   
         // generate and store new invite
         const newInvite = newUserInvite({ email });
         const mongoRes = await db.collection("unregistered").insertOne(newInvite);
         
         // return token
         if (mongoRes.acknowledged) {
            return NextResponse.json(
               { newInvite },
               { status: 200 }
            )
         } else {
            return NextResponse.json(
               { error: "Unable to create unregistered user" },
               { status: 500 }
            )
         }

      } catch(error) {
         return NextResponse.json(
            { error: `Unable to create unregistered user: ${error}` },
            { status: 500 }
         )
      }
   }
)