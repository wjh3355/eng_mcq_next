import { newUserDocuments, UserAuthDocument } from "@/definitions";
import { sendPasswordResetEmail } from "@/lib/email/emailActions";
import client from "@/lib/mongodb/db";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const reqSchema = z.object({
   email: z.string().email().nonempty(),
})

export async function POST(req: NextRequest) {
   
   try {

      // check params
      // should never actually fail since the params are validated client-side
      const validationRes = reqSchema.safeParse(await req.json());
      if (!validationRes.success) {
         return NextResponse.json(
            { error: "Invalid params" },
            { status: 400 }
         );
      }

      const { email } = validationRes.data;

      await client.connect();
      const auth = client.db("userDatas").collection("auth");

      // check if user exists
      const userIfAny = await auth.findOne(
         { email }, 
         { projection: { _id: 0 } }
      ) as unknown as UserAuthDocument | null;

      // if user does not exist, still return success 
      // (to prevent malicious users from knowing if an email is registered)
      if (!userIfAny) return NextResponse.json({ success: true }, { status: 200 });

      // if user exists, generate a new token and expiry
      const newToken = randomBytes(50).toString("hex");
      const newExp = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(); // 24 hours from now

      // send password reset email
      await sendPasswordResetEmail(email, newToken, newExp);

      // update user's token and expiry
      const res = await auth.updateOne({ email }, {
         $set: {
            psdResetToken: newToken,
            psdResetTokenExpiry: newExp
         }
      });

      // check if update was successful, return success if it was, else return error
      if (res.modifiedCount) {
         return NextResponse.json({ success: true }, { status: 200 });
      } else {
         return NextResponse.json(
            { error: "Something went wrong. Please try again" },
            { status: 500 }
         )
      }
      
   } catch (error) {
      return NextResponse.json(
         { error: "Something went wrong. Please try again" },
         { status: 500 }
      )
   }
}
