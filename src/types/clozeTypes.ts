export type ClozeObj = {
   qnNum: number,
   title: string,
   passage: string
}

export type ClozeContextValue = {
   prevUserCorrectAns: null | number[],
   wordsToTestArr: string[][],
   textArr: string[],
   qnNum: number,
   title: string,
   isLoading: boolean,
   error: string,
   handleCompletion: (correctAns: number[]) => Promise<void>,
   handleReset: () => Promise<void>
}

export const EMPTY_CLOZE_CONTEXT_VALUE: ClozeContextValue = {
   prevUserCorrectAns: null,
   wordsToTestArr: [],
   textArr: [],
   qnNum: NaN,
   title: "",
   isLoading: true,
   error: "",
   async handleCompletion() {},
   async handleReset() {}
}

export type ClozeFormData = Record<
   number, 
   {
      value: string,
      correctAnswers: string[],
      isCorrect: boolean | null
   }
>;