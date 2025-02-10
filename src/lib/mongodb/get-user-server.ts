import { UserAuthDocument, UserProfileDocument } from "@/definitions";
import client from "./db";

export async function getUserServer({ email, type }: { email: string, type: "auth" | "profile" }) {

   try {

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

   } catch (error) {
      console.error(error);
      throw new Error("Error getting user server side")
   }

}

export async function getAllUsersServer() {

   try {

      await client.connect();
   
      const authData = await client
         .db("userDatas")
         .collection("auth")
         .find({}, { projection: { _id: 0 } })
         .toArray() as unknown as UserAuthDocument[];
      
      const profileData = await client
         .db("userDatas")
         .collection("profile")
         .find({}, { projection: { _id: 0 } })
         .toArray() as unknown as UserProfileDocument[];
      
      const combinedArray: [UserAuthDocument, UserProfileDocument][] = [];
         
      for (const authDoc of authData) {
         const correspondingProfile = profileData.find(p => p.email === authDoc.email)

         if (!correspondingProfile) throw new Error(`No corresponding profile document for user ${authDoc.email}`)

         combinedArray.push([authDoc, correspondingProfile]);
      }

      return combinedArray;

   } catch (error) {
      console.error(error);
      throw new Error("Error getting all users server side")
   }
}