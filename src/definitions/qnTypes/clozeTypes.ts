export type Cloze = {
   qnNum: number,
   title: string,
   passage: string
}

export type ClozeContextVal = {
   clozeState: ClozeBlankState[]
   clozePassageArray: string[],
   clozeTitle: string,
   score: number,
   triesLeft: number,
   isClozeSubmitted: boolean,
   handleBlankUpdate: (idx: number, v: string) => void,
   handleResetAllBlanks: () => void,
   submitCloze: (a: ClozeBlankState[], b: number) => void,
   resetCloze: () => void
}

export type ClozeBlankState = {
   blankIdx: number;
   blankCorrectAns: string[];
   answer: string;
   status: "not submitted" | "correct" | "incorrect";
};