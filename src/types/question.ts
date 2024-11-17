export type MCQContextValue = {
   qnObj: QnObj,
   wrongAnsArr: QnObj[],
   error: string,
   isLoading: boolean,
   isCorrect: boolean | null,
   isNextQnBtnDisabled: boolean,
   score: [number, number],
   hasReachedEnd: boolean,
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
   async handleOptionClick() {},
   isCorrect: null,
   isNextQnBtnDisabled: true,
   handleNextQnBtnClick() {},
   score: [0, 0],
   wrongAnsArr: [],
   error: "",
   redoSet() {},
   hasReachedEnd: false
}