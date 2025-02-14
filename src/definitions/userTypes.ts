import { McqCategory } from "./qnSetData";
import { randomBytes } from "crypto";
import { hashSync } from "bcryptjs";

export type McqCategoryUserData = {
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
   qnData: Record<McqCategory, McqCategoryUserData>;
   clozeData: {
      qnNum: number;
      correctAns: number[];
   }[];
   spellingData: McqCategoryUserData;
   score: number;
   dateCreated: string;
};

export const EMPTY_USER: UserProfileDocument = {
   email: "",
   qnData: {
      gep: { numQnsAttempted: 0, wrongQnNums: [] },
      phrasalVerbs: { numQnsAttempted: 0, wrongQnNums: [] },
      psleGrammar: { numQnsAttempted: 0, wrongQnNums: [] },
      pslePhrasesCloze: { numQnsAttempted: 0, wrongQnNums: [] },
      psleWordsCloze: { numQnsAttempted: 0, wrongQnNums: [] },
      psleWordsMcq: { numQnsAttempted: 0, wrongQnNums: [] },
   },
   clozeData: [],
   spellingData: { numQnsAttempted: 0, wrongQnNums: [] },
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
      qnData: {
         gep: { numQnsAttempted: 0, wrongQnNums: [] },
         phrasalVerbs: { numQnsAttempted: 0, wrongQnNums: [] },
         psleGrammar: { numQnsAttempted: 0, wrongQnNums: [] },
         pslePhrasesCloze: { numQnsAttempted: 0, wrongQnNums: [] },
         psleWordsCloze: { numQnsAttempted: 0, wrongQnNums: [] },
         psleWordsMcq: { numQnsAttempted: 0, wrongQnNums: [] },
      },
      clozeData: [],
      spellingData: { 
         numQnsAttempted: 0, wrongQnNums: []
      },
      score: 0,
      dateCreated: new Date().toISOString(),
   };

   return { newAuthDoc, newProfileDoc };
}

export const RESET_PROFILE_FIELDS_OBJ: {
   qnData: Record<McqCategory, McqCategoryUserData>;
   clozeData: {
      qnNum: number;
      correctAns: number[];
   }[];
   spellingData: McqCategoryUserData;
   score: number;
} = {
   qnData: {
      gep: { numQnsAttempted: 0, wrongQnNums: [] },
      phrasalVerbs: { numQnsAttempted: 0, wrongQnNums: [] },
      psleGrammar: { numQnsAttempted: 0, wrongQnNums: [] },
      pslePhrasesCloze: { numQnsAttempted: 0, wrongQnNums: [] },
      psleWordsCloze: { numQnsAttempted: 0, wrongQnNums: [] },
      psleWordsMcq: { numQnsAttempted: 0, wrongQnNums: [] },
   },
   clozeData: [],
   spellingData: { 
      numQnsAttempted: 0, wrongQnNums: []
   },
   score: 0
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
