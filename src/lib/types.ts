export interface QuestionContextProviderValueType {
   qnObj: QnObjType | null,
   qnSet: string,
   handleOptionClick: (isCorrect: boolean) => void,
   isCorrect: boolean | null,
   isExplBtnDisabled: boolean,
   isNextQnBtnDisabled: boolean,
   handleNextQnBtnClick: () => void,
   numQnsAns: number,
   numCorrectAns: number,
   wrongAnsArr: QnObjType[]
};

export interface QnObjType {
   qnNum: number,
   sentence: string,
   wordToTest?: string,
   options: string[],
   correctAns: string,
   rootWord: string,
   type: string,
   def: string
};

export const initialContextValue = {
   qnObj: null,
   qnSet: '',
   handleOptionClick() {},
   isCorrect: null,
   isExplBtnDisabled: true,
   isNextQnBtnDisabled: true,
   handleNextQnBtnClick() {},
   numQnsAns: 0,
   numCorrectAns: 0,
   wrongAnsArr: []
}