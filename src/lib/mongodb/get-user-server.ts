import { UserAuthDocument, UserProfileDocument } from "@/definitions";
import client from "./db";

export async function getUserServer({ email, type }: { email: string, type: "auth" | "profile" }) {
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

export async function getAllUsersServer() {
   await client.connect();

   const authData = await client
      .db("userDatas")
      .collection("auth")
      .find({}, { projection: { _id: 0 } })
      .toArray();
   
   const profileData = await client
      .db("userDatas")
      .collection("profile")
      .find({}, { projection: { _id: 0 } })
      .toArray();
}