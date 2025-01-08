import { QnCategory } from "./qnSetData";

export type QnCategoryUserData = {
   numQnsAttempted: number;
   wrongQnNums: number[];
}

export type UserData = {
   name: string;
   dateCreated: Date;
   
   qnData: Partial<Record<QnCategory, QnCategoryUserData>>;

   clozeData: {
      qnNum: number
      correctAns: number[]
   }[];
   
   score: number
};

export function makeNewUserDoc(newName: string): UserData {
   return {
      name: newName,
      dateCreated: new Date(),
      qnData: {},
      clozeData: [],
      score: 0
   };
};

export type HeaderUserDetails = {
   kindeUserEmail: string
   kindeUserId: string
   kindeUserGivenName: string
};