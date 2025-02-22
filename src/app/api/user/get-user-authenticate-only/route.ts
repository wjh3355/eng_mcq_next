import client from "@/lib/mongodb/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const paramSchema = z.object({
   email: z.string().email(),
})

export async function GET(req: NextRequest) {
   
   // this route is only used server-side in the auth.ts file.
   
   // check if request is authorised (using the auth.js V5 secret key)
   if (req.headers.get("Authorization") !== `Bearer ${process.env.AUTH_SECRET}`) {
      return NextResponse.json(
         { error: "Unauthorised" }, 
         { status: 401 }
      );
   }      

   const paramZodRes = paramSchema.safeParse({
      email: req.nextUrl.searchParams.get("email"),
   })
   // check params
   if (!paramZodRes.success) {
      return NextResponse.json(
         { error: "Invalid params" },
         { status: 400 }
      );
   }

   const { email } = paramZodRes.data;

   try {

      await client.connect();

      // check if user exists
      const db = client.db("userDatas");
      const userDoc = await db.collection("auth").findOne({ email });

      if (!userDoc) {
         return NextResponse.json(
            { error: "No user found" },
            { status: 404 }
         );
      }

      return NextResponse.json({ userDoc }, { status: 200 });

   } catch (error) {
      return NextResponse.json(
         { error: "Error while fetching user" },
         { status: 500 }
      );
   }
}
