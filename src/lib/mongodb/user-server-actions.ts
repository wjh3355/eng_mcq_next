"use server";

import { newUserInvite, QnCategory, UserAuthDocument, UserInviteDocument, UserProfileDocument } from "@/definitions";
import client from "./db";
import { UserAuthDataSchema, UserInviteSchema, UserProfileDataSchema } from "../zod/zodSchemas";
import { z } from "zod";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function fetchUser(
   email: string,
   type: "auth"
): Promise<UserAuthDocument>;

export async function fetchUser(
   email: string,
   type: "profile"
): Promise<UserProfileDocument>;

export async function fetchUser(email: string, type: "auth" | "profile"): Promise<UserAuthDocument | UserProfileDocument> {

   try {

      const session = await auth();

      if (!session) throw new Error("Unauthorized");

      await client.connect();
   
      const res = await client
         .db("userDatas")
         .collection(type)
         .findOne(
         { email },
         { projection: { _id: 0 } }
      );
   
      if (!res) throw new Error("User data not found");
   
      const zr = type === "auth" ? UserAuthDataSchema.safeParse(res) : UserProfileDataSchema.safeParse(res);

      if (!zr.success) throw new Error("Type validation failed: " + zr.error);

      return zr.data;

   } catch (error) {
      if (error instanceof Error) {
         console.error(`Unable to fetch user ${email}:\n` + error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }

}

export async function fetchAllUsers() {

   try {

      const session = await auth();

      if (!session) throw new Error("Unauthorized");

      await client.connect();
   
      const authRes = await client
         .db("userDatas")
         .collection("auth")
         .find({}, { projection: { _id: 0 } })
         .toArray();
      
      const profileData = await client
         .db("userDatas")
         .collection("profile")
         .find({}, { projection: { _id: 0 } })
         .toArray();
         
      const zd1 = z.array(UserAuthDataSchema).safeParse(authRes);
      const zd2 = z.array(UserProfileDataSchema).safeParse(profileData);

      if (!zd1.success) throw new Error("Type validation failed for auth data: " + zd1.error);
      if (!zd2.success) throw new Error("Type validation failed for profile data: " + zd2.error);

      const combinedArray: [UserAuthDocument, UserProfileDocument][] = [];
         
      for (const authDoc of zd1.data) {
         const correspondingProfile = zd2.data.find(p => p.email === authDoc.email)

         if (!correspondingProfile) throw new Error(`No corresponding profile document for user ${authDoc.email}`)

         combinedArray.push([authDoc, correspondingProfile]);
      }

      return combinedArray;

   } catch (error) {
      if (error instanceof Error) {
         console.error("Unable to fetch all users:\n" + error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
}

export async function updateUserProfile(
   email: string,
   action: {
      todo: "update mcq",
      mcqCategory: QnCategory,
      mcqCatQnNum: number,
      isCorrect: boolean
   } | {
      todo: "update cloze",
      clozeQnNum: number,
      correctAns: number[] | null
   }
) {
   try {

      const session = await auth();
      if (!session) throw new Error("Unauthorized");

      await client.connect();
      const profileDb = client.db("userDatas").collection<UserProfileDocument>("profile");
      const profile = await profileDb.findOne({ email }, { projection: { _id: 0 } })
      if (!profile) throw new Error(`User profile for ${email} not found`);

      switch (action.todo) {

         case "update mcq":
               
            const { mcqCategory, mcqCatQnNum, isCorrect } = action;

            const updateQuery: any = { 
               $inc: { 
                  [ `qnData.${mcqCategory}.numQnsAttempted` ]: 1 
               } 
            };
      
            if (isCorrect === false) {
               updateQuery.$addToSet = { 
                  [ `qnData.${mcqCategory}.wrongQnNums` ]: mcqCatQnNum 
               }
            } else if (isCorrect === true) {
               updateQuery.$inc.score = 10
            };
      
            const setQuery = {
               $set: {
                  [`qnData.${mcqCategory}`]: {
                     numQnsAttempted: 1,
                     wrongQnNums: isCorrect ? [] : [mcqCatQnNum]
                  }
               },
               $inc: {
                  score: isCorrect ? 10 : 0
               }
            }
            
            if (profile.qnData[mcqCategory as QnCategory] === undefined) {
               await profileDb.updateOne({ email }, setQuery);
            } else {
               await profileDb.updateOne({ email }, updateQuery);
            }

            break;
         
         case "update cloze": 

            const { clozeQnNum, correctAns } = action

            if (correctAns) {
               await profileDb.updateOne({ email }, { $push: { clozeData: { qnNum: clozeQnNum, correctAns } } } );
            } else {
               await profileDb.updateOne( { email }, { $pull: { clozeData: { qnNum: clozeQnNum } } } );
            }

            break;
      
         // no default case, action.todo already validated
      }

   } catch (error) {
      if (error instanceof Error) {
         console.error(`Unable to update user profile for ${email}:\n` + error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
}

export async function resetUserData(email: string) {

   try {

      const session = await auth();

      if (!session) throw new Error("Unauthorized");

      await client.connect();
      const profileDb = client.db("userDatas").collection<UserProfileDocument>("profile");
      const profile = await profileDb.findOne({ email }, { projection: { _id: 0 } });
      if (!profile) throw new Error(`User profile for ${email} not found`);

      await profileDb.updateOne({ email }, { $set: { qnData: {}, clozeData: [], score: 0 } });

      revalidatePath("/profile");

   } catch (error) {
      if (error instanceof Error) {
         console.error(`Unable to reset user data for ${email}:\n` + error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
}

export async function createNewUnregUser(email: string) {
   
   try {

      const session = await auth();

      if (session?.user.role !== "admin") throw new Error("Unauthorized");

      await client.connect();
      const db = client.db("userDatas");

      // check if user already exists (fully registered, present in `auth` collection)
      // or has pending invite (present in `unregistered` collection)
      const existingUser = await db.collection("auth").findOne({ email }, { projection: { _id: 0 } }) as unknown as UserAuthDocument | null;
      const existingInvite = await db.collection("unregistered").findOne({ email }, { projection: { _id: 0 } }) as unknown as UserInviteDocument | null;
      if (existingUser) throw new Error("User already fully registered");
      if (existingInvite) throw new Error("User already has pending invite");

      // create new invite
      const newInvite = newUserInvite({ email });
      await db.collection("unregistered").insertOne(newInvite);

      // revalidate unreg-users page
      revalidatePath("/admin/unreg-users");

   } catch (error) {
      if (error instanceof Error) {
         console.error(`Unable to create new invite for ${email}:\n` + error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
}

export async function fetchAllInvites(): Promise<UserInviteDocument[]> {
   try {

      const session = await auth();

      if (session?.user.role !== "admin") throw new Error("Unauthorized");

      await client.connect();
      const res = await client
         .db("userDatas")
         .collection("unregistered")
         .find({}, { projection: { _id: 0 } })
         .toArray();

      const zr = z.array(UserInviteSchema).safeParse(res);

      if (!zr.success) throw new Error("Type validation failed: " + zr.error);

      return zr.data;

   } catch (error) {
      if (error instanceof Error) {
         console.error(`Unable to fetch invites:\n` + error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
}

export async function toggleSuspend(email: string, isSuspended: boolean) {
   try {

      const session = await auth();

      if (session?.user.role !== "admin") throw new Error("Unauthorized");

      await client.connect();
      const authDb = client.db("userDatas").collection<UserAuthDocument>("auth");

      const user = await authDb.findOne({ email }, { projection: { _id: 0 } });
      if (!user) throw new Error("User not found");

      await authDb.updateOne({ email }, { $set: { isSuspended } });

      revalidatePath("/admin");

   } catch (error) {
      if (error instanceof Error) {
         console.error(`Unable to toggle suspend for ${email}:\n` + error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
   
}

export async function deleteUser(email: string) {
   try {

      // check if user is admin
      const session = await auth();
      if (session?.user.role !== "admin") throw new Error("Unauthorized");

      // check if user is trying to delete own account
      if (session.user.email === email) throw new Error("Cannot delete own account");

      // find and delete user
      await client.connect();
      const authDb = client.db("userDatas").collection<UserAuthDocument>("auth");
      const profileDb = client.db("userDatas").collection<UserProfileDocument>("profile");

      const user = await authDb.findOne({ email }, { projection: { _id: 0 } });
      if (!user) throw new Error("User not found");

      await authDb.deleteOne({ email });
      await profileDb.deleteOne({ email });

      revalidatePath("/admin");

   } catch (error) {
      if (error instanceof Error) {
         console.error(`Unable to delete user ${email}:\n` + error.message);
         throw new Error(error.message);
      } else {
         console.error("An unexpected error occured:", error);
         throw new Error("An unexpected error occured");
      }
   }
}