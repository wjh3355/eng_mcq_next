import { randomBytes } from "crypto";
import { hashSync } from "bcryptjs";
import { Collections } from "./qnTypes/questionTypes";

// example user AUTH document
// {
//    "_id": {
//      "$oid": "67a40697f1085810c051cc6f"
//    },
//    "email": "jhwang0324@gmail.com",
//    "passwordHash": "$2a$12$XTGlQRISa.Jv2VMYLQukKeVtXeIS/dHdhgtIfEs.fXWVxMQNEodL6",
//    "role": "admin",
//    "psdResetToken": null,
//    "psdResetTokenExpiry": null,
//    "dateCreated": "2025-02-06T00:47:16.104Z",
//    "isSuspended": false
// }

// example user PROFILE document
// {
//    "_id": {
//      "$oid": "67a40697f1085810c051cc89"
//    },
//    "email": "jhwang0324@gmail.com",
//    "qnData": {
//      "gep": {
//        "numQnsAttempted": 0,
//        "wrongQnNums": []
//      } ... etc
//    },
//    "clozeData": [],
//    "mockTestData": [],
//    "score": 60,
//    "dateCreated": "2025-02-06T00:47:16.104Z"
// }

export type QnCollectionUserDat = {
   numQnsAttempted: number;
   wrongQnNums: number[];
};

export type ClozeUserDat = {
   qnNum: number;
   correctAns: number[];
}

export type MockTestUserDat = {
   mockTestNumber: number;
   score: number;
   wrongQuestions: { col: Collections, qnNum: number, userWrongAns: string }[];
   clozeData: {
      blankNum: number,
      ans: string,
      isCorrect: boolean
   }[];
}

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
   qnData: Record<Collections, QnCollectionUserDat>;
   clozeData: ClozeUserDat[];
   mockTestData: MockTestUserDat[];
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
      spelling: { numQnsAttempted: 0, wrongQnNums: [] },
      definition: { numQnsAttempted: 0, wrongQnNums: [] },
      demo: { numQnsAttempted: 0, wrongQnNums: [] },
      test: { numQnsAttempted: 0, wrongQnNums: [] },
   },
   clozeData: [],
   mockTestData: [],
   score: 0,
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
      ...EMPTY_USER,
      email,
      dateCreated: new Date().toISOString(),
   };

   return { newAuthDoc, newProfileDoc };
}

export const RESET_PROFILE_FIELDS_OBJ: Partial<UserProfileDocument> = {
   qnData: EMPTY_USER.qnData,
   clozeData: EMPTY_USER.clozeData,
   score: EMPTY_USER.score
}

export function newUserInvite({ email }: { email: string }): UserInviteDocument {
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