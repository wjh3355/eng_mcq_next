export type ClozeObj = {
   qnNum: number,
   title: string,
   passage: string
}

export type ClozeContextValue = {
   isDemo: boolean
   prevUserCorrectAns: null | number[],
   wordsToTestArr: string[][],
   textArr: string[],
   qnNum: number,
   passageTitle: string,
   isLoading: boolean,
   error: string,
   handleCompletion: (correctAns: number[]) => Promise<void>,
   handleReset: () => Promise<void>
}

export const EMPTY_CLOZE_CONTEXT_VALUE: ClozeContextValue = {
   isDemo: false,
   prevUserCorrectAns: null,
   wordsToTestArr: [],
   textArr: [],
   qnNum: NaN,
   passageTitle: "",
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