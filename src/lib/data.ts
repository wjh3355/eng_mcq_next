export type GenericMCQContextValueType = {
   qnCategoryTitleName: string,
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
   qnCategoryTitleName: '',
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

export type QnCategoryDataType = {
   titleName: string;
   mongoCollection: string;
   sets: Array<{
      slug: undefined | string;
      qnNumRange: [number, number];
      name: string;
      href: string;
   }>;
}

export type CurrentQnCategories = 
   'demo' | 

   'gep' | 

   'phrasalVerbs' | 

   'psleWordsCloze' | 
   'psleWordsMcq' | 
   'pslePhrasesCloze' | 

   'test';

const qnCategoriesData: Record<CurrentQnCategories, QnCategoryDataType> = {

   demo: {
      titleName: "Demo Questions",
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
      titleName: "GEP Vocab MCQ",
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
      titleName: "Phrasal Verbs Cloze",
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
      titleName: "PSLE Words Cloze",
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
      titleName: "PSLE Words MCQ",
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
      titleName: "PSLE Phrases Cloze",
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
            slug: undefined,
            qnNumRange: [1, 151],
            name: "All Questions",
            href: "/psle/phrases/cloze"
         }
      ]
   },

   test: {
      titleName: "test",
      mongoCollection: "test",
      sets: [
         {
            slug: "test",
            qnNumRange: [999, 99999],
            name: "test",
            href: "test"
         }
      ]
   }
}

export default qnCategoriesData;