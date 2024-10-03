export type GenericMCQContextValueType = {
   qnObj: QnObjType,
   isLoading: boolean,
   qnSetName: string,
   handleOptionClick: (isCorrect: boolean) => void,
   isCorrect: boolean | null,
   isExplBtnDisabled: boolean,
   isNextQnBtnDisabled: boolean,
   handleNextQnBtnClick: () => void,
   numQnsAns: number,
   numCorrectAns: number,
   wrongAnsArr: QnObjType[],
   error: string
}

export type QnObjType = {
   qnNum: number,
   sentence: string,
   wordToTest: string | null,
   options: string[],
   correctAns: string,
   rootWord: string,
   type: string,
   def: string
}

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

export const emptyContextValue: GenericMCQContextValueType = {
   qnObj: emptyQnObj,
   isLoading: true,
   qnSetName: '',
   handleOptionClick() {},
   isCorrect: null,
   isExplBtnDisabled: true,
   isNextQnBtnDisabled: true,
   handleNextQnBtnClick() {},
   numQnsAns: NaN,
   numCorrectAns: NaN,
   wrongAnsArr: [],
   error: ''
}

export type MongoCollectionNames = 
   'demo' |

   'gep_vocab' | 
   'phrasal_verbs' | 

   'psle_words_cloze' |
   'psle_words_mcq' |
   
   'psle_phrases_cloze'

export type QnSetIntervalsType = {
   slug: undefined | string,
   displayedName: string,
   range: [number, number]
}[]

export type NavLinksArrayType = {
   displayedName: string,
   linksTo: string
}[]