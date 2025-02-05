import { UserAuthDocument, UserProfileDocument } from "@/definitions";
import client from "./db";

export default async function getUserServer({ email, type }: { email: string, type: "auth" | "profile" }) {
   await client.connect();

   const data = await client
      .db("userDatas")
      .collection(type)
      .findOne(
      { email },
      { projection: { _id: 0 } }
   );

   if (!data) throw new Error("User data not found");

   if (type === "auth") {
      return data as unknown as UserAuthDocument;
   } else {
      return data as unknown as UserProfileDocument;
   }
} 