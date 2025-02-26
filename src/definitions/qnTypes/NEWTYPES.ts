export type QuestionCategories = 
   'gep' 
   | 'phrasalVerbs' 
   | 'psleWordsCloze' 
   | 'psleWordsMcq' 
   | 'pslePhrasesCloze' 
   | 'psleGrammar'
   | 'spelling'
   | 'definition'
   | 'demo'
;
// that should be all?

export type QuestionContextVal = {
   qnCategory: QuestionCategories,
   qnObj: Question,
   isLoading: boolean,
   setInfo: {
      numQnsInSet: number,
      currQnNum: number,
      hasReachedEnd: boolean,
   },
   userInfo: {
      userPoints: number,
      numCorrect: number,
      numAttempted: number,
      isCorrect: boolean | null,
      wronglyAnswered: Question[],
   },
   callbacks: {
      handleAttempt: (param: boolean) => void,
      handleNextQnBtnClick: () => void,
      redoSet: () => void
   }
}

export type Question = {
   category: "synonym" | "spelling" | "definition" | "blank",
   qnNum: number,
   sentence: string,
   wordToTest: string | null,
   options: string[] | null,
   correctAns: string,
   rootWord: string | null,
   type: string,
   def: string | null
}

export const EMPTY_QUESTION: Question = {
   category: "synonym",
   qnNum: NaN,
   sentence: '',
   wordToTest: null,
   options: null,
   correctAns: '',
   rootWord: null,
   type: '',
   def: null
}