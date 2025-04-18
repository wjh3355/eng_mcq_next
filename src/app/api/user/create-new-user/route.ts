import { newUserDocuments } from "@/definitions";
import client from "@/lib/mongodb/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const reqSchema = z.object({
   email: z.string().nonempty().email(),
   password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/),
   token: z.string().regex(/^[0-9a-fA-F]{100}$/)
})

export async function POST(req: NextRequest) {
   
   try {

      // check params again for security
      const validationRes = reqSchema.safeParse(await req.json());
      if (!validationRes.success) {
         return NextResponse.json(
            { error: "Invalid params" },
            { status: 400 }
         );
      }

      const { email, password, token } = validationRes.data;

      await client.connect();
      const db = client.db("userDatas");

      // check if token exists
      const pendingUser = await db.collection("unregistered").findOne({ email, token });
      if (!pendingUser) {
         return NextResponse.json(
            { error: "Invalid email or registration token" },
            { status: 400 }
         );
      }

      // if token is valid, create new auth and profile docs for new user
      // password hashing is done in the newUserDocuments function
      // so we just pass in the raw one
      // role = "user" by default (no admins)
      const { newAuthDoc, newProfileDoc } = newUserDocuments({ 
         email, 
         password, 
         role: "user" 
      });

      // inset into respective collections
      const createAuthRes = await db.collection("auth").insertOne(newAuthDoc);
      const createProfileRes = await db.collection("profile").insertOne(newProfileDoc);

      // delete invite
      const deleteRes = await db.collection("unregistered").deleteOne({ _id: pendingUser._id });

      // check if all operations were successful, return appropriate response
      if (createAuthRes.acknowledged && createProfileRes.acknowledged && deleteRes.acknowledged) {
         console.log(`New user successfully registered: ${email} on ${new Date().toLocaleString()}`);
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
