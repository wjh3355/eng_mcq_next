import { QnCategory } from "./qnSetData"

export type MCQContextValue = {
   qnCategory: QnCategory | "demo",
   qnObj: MCQQnObj,
   wrongAnsArr: MCQQnObj[],
   error: string,
   isLoading: boolean,
   isCorrect: boolean | null,
   thisSessionScore: [number, number],
   userPoints: number,
   hasReachedEnd: boolean,
   isSetRandom: boolean,
   handleOptionClick: (param: boolean) => Promise<void>,
   handleNextQnBtnClick: () => void,
   redoSet: () => void
}

export type MCQQnObj = {
   qnNum: number,
   sentence: string,
   wordToTest: string | null,
   options: string[],
   correctAns: string,
   rootWord: string,
   type: string,
   def: string
}

export const EMPTY_MCQ_QN_OBJ: MCQQnObj = {
   qnNum: NaN,
   sentence: '',
   wordToTest: null,
   options: [],
   correctAns: '',
   rootWord: '',
   type: '',
   def: ''
}

export const EMPTY_MCQ_CONTEXT_VALUE: MCQContextValue = {
   qnCategory: "gep",
   qnObj: EMPTY_MCQ_QN_OBJ,
   isLoading: true,
   isCorrect: null,
   thisSessionScore: [0, 0],
   userPoints: 0,
   wrongAnsArr: [],
   error: "",
   hasReachedEnd: false,
   isSetRandom: false,
   async handleOptionClick() {},
   handleNextQnBtnClick() {},
   redoSet() {}
}