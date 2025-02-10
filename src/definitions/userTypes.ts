import { QnCategory } from "./qnSetData";
import { randomBytes } from "crypto";
import { hashSync } from "bcryptjs";

// export type OldUserDocument = {
//    email: string;
//    qnData: Partial<Record<QnCategory, QnCategoryUserData>>;
//    clozeData: {
//       qnNum: number;
//       correctAns: number[];
//    }[];
//    score: number;
//    dateCreated: string;
// }

export type QnCategoryUserData = {
   numQnsAttempted: number;
   wrongQnNums: number[];
};

export type UserAuthDocument = {
   email: string;
   passwordHash: string;
   role: "user" | "admin";
   psdResetToken: string | null;
   psdResetTokenExpiry: string | null;
   dateCreated: string;
   isSuspended: boolean;
};

export type UserProfileDocument = {
   email: string;
   qnData: Partial<Record<QnCategory, QnCategoryUserData>>;
   clozeData: {
      qnNum: number;
      correctAns: number[];
   }[];
   score: number;
   dateCreated: string;
};

export const EMPTY_USER: UserProfileDocument = {
   email: "",
   qnData: {},
   clozeData: [],
   score: NaN,
   dateCreated: ""
}

export type UserInviteDocument = {
   email: string;
   token: string;
   dateCreated: string;
}

export function newUserDocuments({
   email,
   password,
   role,
}: {
   email: string;
   password: string;
   role: "admin" | "user";
}): { 
   newAuthDoc: UserAuthDocument; 
   newProfileDoc: UserProfileDocument 
} {
   const newAuthDoc: UserAuthDocument = {
      email,
      passwordHash: hashSync(password, 12),
      role,
      psdResetToken: null,
      psdResetTokenExpiry: null,
      dateCreated: new Date().toISOString(),
      isSuspended: false
   };

   const newProfileDoc: UserProfileDocument = {
      email,
      qnData: {},
      clozeData: [],
      score: 0,
      dateCreated: new Date().toISOString(),
   };

   return { newAuthDoc, newProfileDoc };
}

export function newUserInvite({
   email
}: {
   email: string
}): UserInviteDocument {
   return {
      email,
      token: randomBytes(50).toString("hex"),
      dateCreated: new Date().toISOString()
   }
}

export type LoginFormFields = {
   email: string;
   password: string;
   rememberMe: boolean;
};
