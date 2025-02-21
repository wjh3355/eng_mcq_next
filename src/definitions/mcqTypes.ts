import { McqCategory } from "./qnSetData"

export type MCQContextValue = {
   numQnsInSet: number,
   currNum: number,
   McqCategory: McqCategory | "demo",
   qnObj: MCQQnObj,
   wrongAnsArr: MCQQnObj[],
   isLoading: boolean,
   isCorrect: boolean | null,
   thisSessionScore: [number, number],
   userPoints: number,
   hasReachedEnd: boolean,
   isSetRandom: boolean,
   handleOptionClick: (param: boolean) => void,
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
   numQnsInSet: NaN,
   currNum: NaN,
   McqCategory: "gep",
   qnObj: EMPTY_MCQ_QN_OBJ,
   isLoading: true,
   isCorrect: null,
   thisSessionScore: [NaN, NaN],
   userPoints: NaN,
   wrongAnsArr: [],
   hasReachedEnd: false,
   isSetRandom: false,
   handleOptionClick() {},
   handleNextQnBtnClick() {},
   redoSet() {}
}