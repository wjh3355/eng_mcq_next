import { CurrentQnCategoriesTracked } from "./qnSetData";

export type UserData = {
   name: string;
   dateCreated: Date;
   
   qnData: Partial<Record<
      CurrentQnCategoriesTracked,
      {
         numQnsAttempted: number;
         wrongQnNums: number[];
      }
   >>;

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