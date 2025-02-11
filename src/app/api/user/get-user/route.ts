import { auth } from "@/auth";
import client from "@/lib/mongodb/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const paramSchema = z.object({
   email: z.string().nonempty(),
   type: z.enum(["auth", "profile"])
})

export async function GET(req: NextRequest) {
   
   // check params
   // should never actually fail since the params are validated client-side
   const paramZodRes = paramSchema.safeParse({
      email: req.nextUrl.searchParams.get("email"),
      type: req.nextUrl.searchParams.get("type")
   })

   if (!paramZodRes.success) {
      return NextResponse.json(
         { error: "Invalid params" },
         { status: 400 }
      );
   }

   const { email, type } = paramZodRes.data;

   // check if user being fetched is the same as the authenticated user. 
   // if not, check if the authenticated user is an admin (always allowed)
   // if (!req.auth || (req.auth.user.role !== "admin" && req.auth.user.email !== email)) {
   //    return NextResponse.json(
   //       { error: "Unauthorized" },
   //       { status: 403 }
   //    )
   // }
   
   try {
   
      await client.connect();

      // fetch user data of the type specified
      const db = client.db("userDatas");
      const userDoc = await (
         type === "auth" 
            ? db.collection("auth").findOne({ email })
            : db.collection("profile").findOne({ email })
      );

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
};