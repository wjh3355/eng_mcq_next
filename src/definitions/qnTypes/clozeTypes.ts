export type Cloze = {
   qnNum: number,
   title: string,
   passage: string
}

export type ClozeContextVal = {
   isDemo: boolean
   prevUserCorrectAns: null | number[],
   wordsToTestArr: string[][],
   textArr: string[],
   qnNum: number,
   passageTitle: string,
   isLoading: boolean,
   handleCompletion: (correctAns: number[]) => void,
   handleReset: () => void
}

export type ClozeFormData = Record<
   number, 
   {
      value: string,
      correctAnswers: string[],
      isCorrect: boolean | null
   }
>;