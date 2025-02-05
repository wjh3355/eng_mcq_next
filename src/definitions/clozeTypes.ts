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
   handleCompletion: (correctAns: number[]) => void,
   handleReset: () => void
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
   handleCompletion() {},
   handleReset() {}
}

export type ClozeFormData = Record<
   number, 
   {
      value: string,
      correctAnswers: string[],
      isCorrect: boolean | null
   }
>;