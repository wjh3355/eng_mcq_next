import { UserClozeData, EMPTY_USER_CLOZE_DATA } from "./others"

export type MCQContextValue = {
   qnObj: QnObj,
   wrongAnsArr: QnObj[],
   error: string,
   isLoading: boolean,
   isCorrect: boolean | null,
   thisSessionScore: [number, number],
   userScore: number,
   hasReachedEnd: boolean,
   isSetRandom: boolean,
   handleOptionClick: (param: boolean) => Promise<void>,
   handleNextQnBtnClick: () => void,
   redoSet: () => void
}

export type QnObj = {
   qnNum: number,
   sentence: string,
   wordToTest: string | null,
   options: string[],
   correctAns: string,
   rootWord: string,
   type: string,
   def: string
}

export const EMPTY_QN_OBJ: QnObj = {
   qnNum: NaN,
   sentence: '',
   wordToTest: null,
   options: [],
   correctAns: '',
   rootWord: '',
   type: '',
   def: ''
}

export const EMPTY_CONTEXT_VALUE: MCQContextValue = {
   qnObj: EMPTY_QN_OBJ,
   isLoading: true,
   isCorrect: null,
   thisSessionScore: [0, 0],
   userScore: 0,
   wrongAnsArr: [],
   error: "",
   hasReachedEnd: false,
   isSetRandom: false,
   async handleOptionClick() {},
   handleNextQnBtnClick() {},
   redoSet() {}
}

///////////////////////////////////////////////////////////////////

export type ClozeObj = {
   qnNum: number,
   passage: string
}

export type ClozeContextValue = {
   userClozeData: UserClozeData,
   wordsToTestArr: string[][],
   textArr: string[],
   qnNum: number,
   isLoading: boolean,
   error: string,
   handleCompletion: (correctAns: number[]) => Promise<void>,
   handleReset: () => Promise<void>
}

export const EMPTY_CLOZE_CONTEXT_VALUE: ClozeContextValue = {
   userClozeData: EMPTY_USER_CLOZE_DATA,
   wordsToTestArr: [],
   textArr: [],
   qnNum: NaN,
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