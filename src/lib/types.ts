import { 
   GEP_VOCAB_AllowedSetConfigs, 
   PHRASAL_VERBS_AllowedSetConfigs, 
   PSLE_CLOZE_AllowedSetConfigs, 
   PSLE_MCQ_AllowedSetConfigs
} from "./data";

// Context value type for:
// GEP_VOCAB
// PHRASAL_VERBS
export type GenericMCQContextValueType = {
   qnObj: QnObjType,
   qnSet: string,
   handleOptionClick: (isCorrect: boolean) => void,
   isCorrect: boolean | null,
   isExplBtnDisabled: boolean,
   isNextQnBtnDisabled: boolean,
   handleNextQnBtnClick: () => void,
   numQnsAns: number,
   numCorrectAns: number,
   wrongAnsArr: QnObjType[],
   error: string | null
};

// Question object type for:
// GEP_VOCAB (wordToTest is a string)
// PHRASAL_VERBS (wordToTest is null)
export type QnObjType = {
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

// initial value for qnObj state in provider
export const emptyQnObj: QnObjType = {
   qnNum: NaN,
   sentence: '',
   wordToTest: null,
   options: [],
   correctAns: '',
   rootWord: '',
   type: '',
   def: ''
}

// initial value for createContext() function for Generic MCQs
export const emptyContextValue: GenericMCQContextValueType = {
   qnObj: emptyQnObj,
   qnSet: '',
   handleOptionClick() {},
   isCorrect: null,
   isExplBtnDisabled: true,
   isNextQnBtnDisabled: true,
   handleNextQnBtnClick() {},
   numQnsAns: NaN,
   numCorrectAns: NaN,
   wrongAnsArr: [],
   error: null
}

// type of first argument of createGenericMCQProvider()
// names of collections from mongodb
export type AllowedQuestionCategories = 
   'gep_vocab' | 
   'phrasal_verbs' | 
   'psle_cloze' |
   'psle_mcq'
   ;

// type of second argument of createGenericMCQProvider()
// states how many qn sets are in each category, what name and range of qnNum
export type AllowedSetConfigsType = 
   typeof GEP_VOCAB_AllowedSetConfigs | 
   typeof PHRASAL_VERBS_AllowedSetConfigs |
   typeof PSLE_CLOZE_AllowedSetConfigs | 
   typeof PSLE_MCQ_AllowedSetConfigs
   ;