import { Collections, Question } from "./qnTypes/questionTypes";

export type MTState = 
  | {
   qnIndex: number;
   type: "question";
   collection: Collections;
   qnObj: Question;
   answer: string;
   status: "not done" | "done" | "correct" | "incorrect";
} | {
   qnIndex: number;
   type: "cloze blank";
   clozeBlankCorrectAns: string[];
   answer: string;
   status: "not done" | "done" | "correct" | "incorrect";
};

export type MTContextValue = {
   testStates: MTState[];

   clozePassageArray: string[];
   
   totalNumOfPages: number;
   currUserPage: number;
   handleNextPgClick: () => void;
   handlePrevPgClick: () => void;
   handlePaginationClick: (n: number) => void;

   isMTSubmitted: boolean;
   finalScore: number;

   submitMockTest: () => void;
   handleTouched: (n: number, v: string) => void;
   handleReset: (n: number) => void;
   handleResetAllCloze: () => void;
   resetMockTest: () => void;
}

export type MTDataType = {
   mockTestNumber: number;
   qnNums: Partial<Record<Collections, number[]>>;
   clozePassage: number
}