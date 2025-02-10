import { newUserDocuments, UserAuthDocument } from "@/definitions";
import sendPasswordResetEmail from "@/lib/email/sendPasswordResetEmail";
import client from "@/lib/mongodb/db";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const reqSchema = z.object({
   email: z.string().nonempty(),
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

      const { email } = validationRes.data;

      await client.connect();
      const auth = client.db("userDatas").collection("auth");

      const userIfAny = await auth.findOne(
         { email }, 
         { projection: { _id: 0 } }
      ) as unknown as UserAuthDocument | null;

      if (!userIfAny) return NextResponse.json({ success: true }, { status: 200 });

      const newPsdResetToken = randomBytes(50).toString("hex");
      const newPsdResetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

      await sendPasswordResetEmail(email, newPsdResetToken, newPsdResetTokenExpiry);

      const res = await auth.updateOne({ email }, {
         $set: {
            psdResetToken: newPsdResetToken,
            psdResetTokenExpiry: newPsdResetTokenExpiry
         }
      });

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
