// Context value type for:
// GEP_VOCAB
// PHRASAL_VERBS
export interface GenericMCQContextValueType {
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

// Question object type for:
// GEP_VOCAB (wordToTest is a string)
// PHRASAL_VERBS (wordToTest is null)
export interface QnObjType {
   qnNum: number,
   sentence: string,
   wordToTest: string | null,
   options: string[],
   correctAns: string,
   rootWord: string,
   type: string,
   def: string
};

// Nav links type for drop down navlinks
export type NavLinksArrayType = {
   name: string,
   href: string
}[];

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