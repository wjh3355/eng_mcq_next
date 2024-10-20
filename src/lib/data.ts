export type GenericMCQContextValueType = {
   qnObj: QnObjType,
   wrongAnsArr: QnObjType[],
   error: string,
   isLoading: boolean,
   isCorrect: boolean | null,
   areBtnsDisabled: boolean,
   score: [number, number], 
   handleOptionClick: (param: boolean) => void,
   handleNextQnBtnClick: () => Promise<void>,
   showWrongQnsAgain: () => void
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
   handleOptionClick() {},
   isCorrect: null,
   areBtnsDisabled: true,
   async handleNextQnBtnClick() {},
   score: [0, 0],
   wrongAnsArr: [],
   error: "",
   showWrongQnsAgain() {}
}

export type CurrentQnCategories = 
   'demo' | 
   'gep' | 
   'phrasalVerbs' | 
   'psleWordsCloze' | 
   'psleWordsMcq' | 
   'pslePhrasesCloze';

export type CurrentQnCategoriesDisplayedName = 
   "Demo Questions" |
   "GEP Vocab MCQ" |
   "Phrasal Verbs Cloze" |
   "PSLE Words Cloze" |
   "PSLE Words MCQ" |
   "PSLE Phrases Cloze";

export type QnCategoryDataType = {
   name: CurrentQnCategoriesDisplayedName;
   mongoCollection: string;
   sets: QnSetType[];
}

export type QnSetType = {
   slug: undefined | string;
   qnNumRange: [number, number];
   name: string;
   href: string;
}

const qnCategoriesData: Record<CurrentQnCategories, QnCategoryDataType> = {

   demo: {
      name: "Demo Questions",
      mongoCollection: "demo",
      sets: [
         {  
            slug: undefined,
            qnNumRange: [1, 51],
            name: "",
            href: "",
         }
      ]
   },

   gep: {
      name: "GEP Vocab MCQ",
      mongoCollection: "gep",
      sets: [
         {
            slug: "set1",
            qnNumRange: [1, 101],
            name: "Set 1",
            href: "/gep/set1"
         },
         {
            slug: "set2",
            qnNumRange: [101, 201],
            name: "Set 2",
            href: "/gep/set2"
         },
         {
            slug: "set3",
            qnNumRange: [201, 301],            
            name: "Set 3",
            href: "/gep/set3"
         },
         {
            slug: "set4",
            qnNumRange: [301, 401],            
            name: "Set 4",
            href: "/gep/set4"
         },
         {
            slug: "set5",
            qnNumRange: [401, 501],            
            name: "Set 5",
            href: "/gep/set5"
         },
         {
            slug: "set6",
            qnNumRange: [501, 601],            
            name: "Set 6",
            href: "/gep/set6"
         },
         {
            slug: undefined,
            qnNumRange: [1, 601],
            name: "All Questions",
            href: "/gep"
         }
      ]
   },

   phrasalVerbs: {
      name: "Phrasal Verbs Cloze",
      mongoCollection: "phrasal_verbs",
      sets: [
         {
            slug: "set1",
            qnNumRange: [1, 61],
            name: "Set 1",
            href: "/phrasal_verbs/set1"
         },
         {
            slug: "set2",
            qnNumRange: [61, 121],
            name: "Set 2",
            href: "/phrasal_verbs/set2"
         },
         {
            slug: "set3",
            qnNumRange: [121, 181],
            name: "Set 3",
            href: "/phrasal_verbs/set3"
         },
         {
            slug: "set4",
            qnNumRange: [181, 241],
            name: "Set 4",
            href: "/phrasal_verbs/set4"
         },
         {
            slug: undefined,
            qnNumRange: [1, 241],
            name: "All Questions",
            href: "/phrasal_verbs"
         }
      ]
   },

   psleWordsCloze: {
      name: "PSLE Words Cloze",
      mongoCollection: "psle_words_cloze",
      sets: [
         {
            slug: "set1",
            qnNumRange: [1, 51],
            name: "Set 1",
            href: "/psle/words/cloze/set1"
         },
         {
            slug: "set2",
            qnNumRange: [51, 101],
            name: "Set 2",
            href: "/psle/words/cloze/set2"
         },
         {
            slug: undefined,
            qnNumRange: [1, 101],
            name: "All Questions",
            href: "/psle/words/cloze"
         }
      ]
   },

   psleWordsMcq: {
      name: "PSLE Words MCQ",
      mongoCollection: "psle_words_mcq",
      sets: [
         {
            slug: "set1",
            qnNumRange: [1, 51],
            name: "Set 1",
            href: "/psle/words/mcq/set1"
         },
         {
            slug: "set2",
            qnNumRange: [51, 101],
            name: "Set 2",
            href: "/psle/words/mcq/set2"
         },
         {
            slug: undefined,
            qnNumRange: [1, 101],
            name: "All Questions",
            href: "/psle/words/mcq"
         }
      ]
   },

   pslePhrasesCloze: {
      name: "PSLE Phrases Cloze",
      mongoCollection: "psle_phrases_cloze",
      sets: [
         {
            slug: "set1",
            qnNumRange: [1, 51],
            name: "Set 1",
            href: "/psle/phrases/cloze/set1"
         },
         {
            slug: "set2",
            qnNumRange: [51, 101],
            name: "Set 2",
            href: "/psle/phrases/cloze/set2"
         },
         {
            slug: "set3",
            qnNumRange: [101, 151],
            name: "Set 3",
            href: "/psle/phrases/cloze/set3"
         },
         {
            slug: "set4",
            qnNumRange: [151, 201],
            name: "Set 4",
            href: "/psle/phrases/cloze/set4"
         },
         {
            slug: undefined,
            qnNumRange: [1, 201],
            name: "All Questions",
            href: "/psle/phrases/cloze"
         }
      ]
   }
}

export default qnCategoriesData

export type UserDataType = {
   [qnCategory: string]: {
      numQnsAttempted: number;
      wrongQnNums: number[];
   };
}