import { newUserDocuments } from "@/definitions";
import client from "@/lib/mongodb/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const reqSchema = z.object({
   email: z.string().email().nonempty(),
   password: z.string().nonempty(),
   token: z.string().nonempty()
})

export async function POST(req: NextRequest) {
   
   try {

      const validationRes = reqSchema.safeParse(await req.json());
      // check params
      if (!validationRes.success) {
         return NextResponse.json(
            { error: "Invalid params" },
            { status: 400 }
         );
      }

      const { email, password, token } = validationRes.data;

      await client.connect();
      const db = client.db("userDatas");
      // first check if user already exists in `auth` collection (already registered)
      if (await db.collection("auth").findOne({ email })) {
         return NextResponse.json(
            { error: "User is already registered" },
            { status: 400 }
         );
      }

      // next check if token exists
      const pendingUser = await db.collection("unregistered").findOne({ email, token });
      if (!pendingUser) {
         return NextResponse.json(
            { error: "Invalid registration token" },
            { status: 400 }
         );
      }

      // create new auth and profile docs for new user
      const { newAuthDoc, newProfileDoc } = newUserDocuments({ 
         email, 
         password, 
         role: "user" 
      });

      // inset into respective collections
      const createAuthRes = await db.collection("auth").insertOne(newAuthDoc);
      const createProfileRes = await db.collection("profile").insertOne(newProfileDoc);

      // delete unregistered user
      const deleteRes = await db.collection("unregistered").deleteOne({ _id: pendingUser._id });

      if (createAuthRes.acknowledged && createProfileRes.acknowledged && deleteRes.acknowledged) {
         return NextResponse.json(
            { success: true },
            { status: 200 }
         )
      } else {
         return NextResponse.json(
            { error: "Unable to register user. Please try again" },
            { status: 500 }
         )
      }
      
   } catch (error) {
      return NextResponse.json(
         { error: "Unable to register user. Please try again" },
         { status: 500 }
      )
   }
}
