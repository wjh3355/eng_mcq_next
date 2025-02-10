import { UserAuthDocument } from "@/definitions";
import { sendResetPasswordUpdateEmail } from "@/lib/email/emailActions";
import client from "@/lib/mongodb/db";
import { hashSync } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const reqSchema = z.object({
   newPassword: z.string().nonempty(),
   token: z.string().nonempty(),
})

// NOTE: no emails are handled here, this prevents brute forcing reset token
// even if token is found, attacker won't know which account password got reset
// user will be notified of password reset.

export async function POST(req: NextRequest) {
   
   try {
      
      // check params
      // this should never throw an error since validation is done client side
      const validationRes = reqSchema.safeParse(await req.json());
      if (!validationRes.success) {
         return NextResponse.json(
            { error: "Invalid params" },
            { status: 400 }
         );
      }
      
      const { newPassword, token } = validationRes.data;

      await client.connect();
      const auth = client.db("userDatas").collection("auth");

      // check if token exists
      const userIfAny = await auth.findOne(
         { psdResetToken: token }, 
         { projection: { _id: 0 } }
      ) as unknown as UserAuthDocument | null;

      // if user does not exist, 
      // or somehow doesn't have a reset token expiry date,
      // or if their token is expired,
      // return error code 1 corresponding to generic error (prevent brute forcing token)
      if (
         !userIfAny 
         || !userIfAny.psdResetTokenExpiry
         || new Date(userIfAny.psdResetTokenExpiry) < new Date()
      ) return NextResponse.json({ error: "1" }, { status: 500 });

      // if token is not expired, proceed...
      // UPDATE USER PASSWORD AND REMOVE TOKEN AND EXPIRY
      const res = await auth.updateOne(
         { psdResetToken: token },
         {
            $set: {
               passwordHash: hashSync(newPassword, 12),
               psdResetToken: null,
               psdResetTokenExpiry: null
            }
         }
      )

      // check if update was successful, if yes send email and return success
      if (res.modifiedCount) {
         await sendResetPasswordUpdateEmail(userIfAny.email);

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
