export type MCQContextValue = {
   qnObj: QnObj,
   wrongAnsArr: QnObj[],
   error: string,
   isLoading: boolean,
   isCorrect: boolean | null,
   score: [number, number],
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
   score: [0, 0],
   wrongAnsArr: [],
   error: "",
   hasReachedEnd: false,
   isSetRandom: false,
   async handleOptionClick() {},
   handleNextQnBtnClick() {},
   redoSet() {}
}

////////////////////////////////////////////// 

export type ClozeObj = {
   qnNum: number,
   passage: string
}

export type ClozeContextValue = {
   clozeObj: ClozeObj,
   isLoading: boolean,
   error: string,
}

export const EMPTY_CLOZE_OBJ: ClozeObj = {
   qnNum: NaN,
   passage: ""
}

export const EMPTY_CLOZE_CONTEXT_VALUE: ClozeContextValue = {
   clozeObj: EMPTY_CLOZE_OBJ,
   isLoading: true,
   error: "",
}

export type ClozeFormData = Record<number, {
   value: string,
   correctAnswers: string[],
   isCorrect: boolean | null
}>;