"use server";

import { newUserInvite, McqCategory, UserAuthDocument, UserInviteDocument, UserProfileDocument, RESET_PROFILE_FIELDS_OBJ } from "@/definitions";
import client from "./db";
import { UserAuthDataSchema, UserInviteSchema, UserProfileDataSchema } from "../zod/zodSchemas";
import { z } from "zod";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { UpdateFilter } from "mongodb";

export async function fetchUser(
   email: string,
   type: "auth"
): Promise<UserAuthDocument | { error: string }>;

export async function fetchUser(
   email: string,
   type: "profile"
): Promise<UserProfileDocument | { error: string }>;

export async function fetchUser(email: string, type: "auth" | "profile"): Promise<UserAuthDocument | UserProfileDocument | { error: string }> {

   try {

      const session = await auth();

      if (!session || session.user.email !== email) throw new Error("Unauthorized");

      const _zr = z.string().email().safeParse(email);

      if (!_zr.success) throw new Error("Invalid params");

      await client.connect();
   
      const res = await client
         .db("userDatas")
         .collection(type)
         .findOne(
         { email: _zr.data },
         { projection: { _id: 0 } }
      );
   
      if (!res) throw new Error("User data not found");
   
      const zr = type === "auth" ? UserAuthDataSchema.safeParse(res) : UserProfileDataSchema.safeParse(res);

      if (!zr.success) throw new Error("Type validation failed: " + zr.error);

      return zr.data;

   } catch (error) {
      if (error instanceof Error) {
         console.error(`Unable to fetch user ${email}:\n` + error.message);
         return { error: error.message }
      } else {
         console.error("An unexpected error occured:", error);
         return { error: "Unexpected error occured" }
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
         return { error: error.message }
      } else {
         console.error("An unexpected error occured:", error);
         return { error: "Unexpected error occured" }
      }
   }
}

export async function updateUserProfile(
   email: string,
   action: {
      todo: "update mcq",
      mcqCategory: McqCategory,
      mcqCatQnNum: number,
      isMcqCorrect: boolean
   } | {
      todo: "update cloze",
      clozeQnNum: number,
      correctAns: number[] | null
   } | {
      todo: "update spelling",
      spellingQnNum: number,
      isSpellingCorrect: boolean
   }
) {
   try {

      const session = await auth();
      if (!session) throw new Error("Unauthorized");

      await client.connect();
      const profileDb = client.db("userDatas").collection<UserProfileDocument>("profile");
      const profile = await profileDb.findOne({ email })
      if (!profile) throw new Error(`User profile for ${email} not found`);

      let updateToDo: UpdateFilter<UserProfileDocument> = {};

      switch (action.todo) {

         case "update mcq":
               
            const { mcqCategory, mcqCatQnNum, isMcqCorrect } = action;

            if (isMcqCorrect) {
               updateToDo = { $inc: { [`qnData.${mcqCategory}.numQnsAttempted`]: 1, score: 10 } };
            } else {
               updateToDo = { 
                  $inc: { 
                     [`qnData.${mcqCategory}.numQnsAttempted`]: 1 
                  }, 
                  $addToSet: { 
                     [`qnData.${mcqCategory}.wrongQnNums`]: mcqCatQnNum 
                  } 
               };
            }

            break;
         
         case "update spelling":
            
            const { spellingQnNum, isSpellingCorrect } = action;

            if (isSpellingCorrect) {
               updateToDo = { $inc: { "spellingData.numQnsAttempted": 1, score: 10 } };
            } else {
               updateToDo = { 
                  $inc: { "spellingData.numQnsAttempted": 1 }, 
                  $addToSet: { "spellingData.wrongQnNums": spellingQnNum }
               };
            }

            break;
         
         case "update cloze": 

            const { clozeQnNum, correctAns } = action

            if (correctAns) {
               updateToDo = { $push: { clozeData: { qnNum: clozeQnNum, correctAns } } };
            } else {
               updateToDo = { $pull: { clozeData: { qnNum: clozeQnNum } } };
            }

            break;
      
      }

      await profileDb.updateOne({ email }, updateToDo);

      return { success: true };

   } catch (error) {
      if (error instanceof Error) {
         console.error(`Unable to update user profile for ${email}: ` + error.message);
         return { error: "Could not update user profile due to: " + error.message }
      } else {
         console.error(`Unexpected error occured while updating user profile for ${email}: ` + error);
         return { error: `Unable to update user profile for ${email}. Try again later.` }
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

      await profileDb.updateOne({ email }, { $set: { ...RESET_PROFILE_FIELDS_OBJ } });

      console.log(`User ${email} has just reset their data from their profile page.`);
      return { success: true };

   } catch (error) {
      if (error instanceof Error) {
         console.error(`Unable to reset user data for ${email}:\n` + error.message);
         return { error: error.message }
      } else {
         console.error("An unexpected error occured:", error);
         return { error: "Unexpected error occured" }
      }
   } finally {
      revalidatePath("/profile");
   }
}

export async function createNewInvite(email: string) {
   
   try {

      // check if user is admin
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

      console.log(`New invite has been created for ${email}.`);
      return { success: true };

   } catch (error) {
      if (error instanceof Error) {
         console.error(`Unable to create new invite for ${email}:\n` + error.message);
         return { error: error.message }
      } else {
         console.error("An unexpected error occured:", error);
         return { error: "Unexpected error occured" }
      }
   } finally {
      revalidatePath("/admin/unreg-users");
   }
}

export async function deleteInvite(email: string) {
   try {

      // check if user is admin
      const session = await auth();
      if (session?.user.role !== "admin") throw new Error("Unauthorized");

      // find and delete user invite
      await client.connect();
      const invites = client.db("userDatas").collection<UserInviteDocument>("unregistered");

      const invite = await invites.findOne({ email }, { projection: { _id: 0 } });
      if (!invite) throw new Error("Invite not found");

      await invites.deleteOne({ email });

      console.log(`Invite for ${email} has just been deleted.`);
      return { success: true };

   } catch (error) {
      if (error instanceof Error) {
         console.error(`Unable to delete invite for ${email}:\n` + error.message);
         return { error: error.message }
      } else {
         console.error("An unexpected error occured:", error);
         return { error: "Unexpected error occured" }
      }
   } finally {
      revalidatePath("/admin/unreg-users");
   }
}

export async function fetchAllInvites() {
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
         return { error: error.message }
      } else {
         console.error("An unexpected error occured:", error);
         return { error: "Unexpected error occured" }
      }
   }
}

export async function toggleSuspend(email: string, isSuspended: boolean) {
   try {

      const session = await auth();

      if (session?.user.role !== "admin") throw new Error("Unauthorized");

      if (session.user.email === email) throw new Error("Cannot suspend own account");

      await client.connect();
      const authDb = client.db("userDatas").collection<UserAuthDocument>("auth");

      const user = await authDb.findOne({ email }, { projection: { _id: 0 } });
      if (!user) throw new Error("User not found");

      await authDb.updateOne({ email }, { $set: { isSuspended } });

      console.log(`User ${email} has just been ${isSuspended ? "suspended" : "unsuspended"}.`);
      return { success: true };

   } catch (error) {
      if (error instanceof Error) {
         console.error(`Unable to toggle suspend for ${email}:\n` + error.message);
         return { error: error.message }
      } else {
         console.error("An unexpected error occured:", error);
         return { error: "Unexpected error occured" }
      }
   } finally {
      revalidatePath("/admin");
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

      console.log(`User ${email} has just been deleted.`);
      return { success: true };

   } catch (error) {
      if (error instanceof Error) {
         console.error(`Unable to delete user ${email}:\n` + error.message);
         return { error: error.message }
      } else {
         console.error("An unexpected error occured:", error);
         return { error: "Unexpected error occured" }
      }
   } finally {
      revalidatePath("/admin");
   }
}