export type Collections = 
   'gep' 
   | 'phrasalVerbs' 
   | 'psleWordsCloze' 
   | 'psleWordsMcq' 
   | 'pslePhrasesCloze' 
   | 'psleGrammar'
   | 'spelling'
   | 'definition'
   | 'demo'
   | 'test'
;

export const questionCategoriesArray: Collections[] = [
   "gep", "phrasalVerbs", "psleWordsCloze", "psleWordsMcq", "pslePhrasesCloze", "psleGrammar", "spelling", "definition", "demo", "test"
];

export const questionCategoriesTuple = [
   "gep", "phrasalVerbs", "psleWordsCloze", "psleWordsMcq", "pslePhrasesCloze", "psleGrammar", "spelling", "definition", "demo", "test"
] as const;

export function getDemoQnCat(qnNum: number): string {
   
   let cat: Collections;

   switch (Math.floor((qnNum-1) / 5)) {
      case 0:
         cat = "gep";
         break;
      case 1:
         cat = "phrasalVerbs";
         break;
      case 2:
         cat = "psleWordsCloze";
         break;
      case 3:
         cat = "psleWordsMcq";
         break;
      case 4:
         cat = "pslePhrasesCloze"
         break;
      case 5:
         cat = "psleGrammar";
         break;
      case 6:
         cat = "spelling";
         break;
      case 7:
         cat = "definition";
         break;
      default:
         cat = "gep";
         break;
   }

   return QN_COL_DATA[cat].categoryName;
}

export const QN_COL_DATA: Record<Collections, { categoryName: string; setSize: number }> = {

   gep: {
      categoryName: "GEP Vocab MCQ",
      setSize: 100,
   },

   phrasalVerbs: {
      categoryName: "Phrasal Verbs Cloze",
      setSize: 60,
   },

   psleWordsCloze: {
      categoryName: "PSLE Words Cloze",
      setSize: 50,
   },

   psleWordsMcq: {
      categoryName: "PSLE Words MCQ",
      setSize: 50,
   },

   pslePhrasesCloze: {
      categoryName: "PSLE Phrases Cloze",
      setSize: 50,
   },

   psleGrammar: {
      categoryName: "PSLE Grammar MCQ",
      setSize: 50,
   },

   spelling: {
      categoryName: "Spelling Questions",
      setSize: 50,
   },

   definition: {
      categoryName: "Definition MCQ",
      setSize: 30,
   },

   demo: {
      categoryName: "Demo Questions",
      setSize: 9999,
   },

   test: {
      categoryName: "Test",
      setSize: 9999,
   }
};

export type QuestionContextVal = {
   collection: Collections,
   qnObj: Question,
   isLoading: boolean,
   setInfo: {
      numQnsInSet: number,
      currQnNum: number,
      hasReachedEnd: boolean,
   },
   userInfo: {
      userPoints: number,
      numCorrect: number,
      numAttempted: number,
      isCorrect: boolean | null,
      wronglyAnswered: Question[],
   },
   callbacks: {
      handleAttempt: (param: boolean) => void,
      handleNextQnBtnClick: () => void,
      redoSet: () => void
   }
};

export type Question = {
   kindOfQn: "meaning" | "spelling" | "definition" | "blank",
   qnNum: number,
   sentence: string,
   wordToTest: string | null,
   options: string[] | null,
   correctAns: string,
   rootWord: string | null,
   type: string,
   def: string | null
};

export const EMPTY_QUESTION: Question = {
   kindOfQn: "meaning",
   qnNum: NaN,
   sentence: '',
   wordToTest: null,
   options: null,
   correctAns: '',
   rootWord: null,
   type: '',
   def: null
};