export type McqCategory = 'gep' | 'phrasalVerbs' | 'psleWordsCloze' | 'psleWordsMcq' | 'pslePhrasesCloze' | 'psleGrammar';

export const qnCategoriesArray: McqCategory[] = [
   "gep", "phrasalVerbs", "psleWordsCloze", "psleWordsMcq", "pslePhrasesCloze", "psleGrammar"
];

export const qnCategoriesArrayTuple = [
   "gep", "phrasalVerbs", "psleWordsCloze", "psleWordsMcq", "pslePhrasesCloze", "psleGrammar"
] as const;

export type McqCategoryData = { categoryName: string; setSize: number };

export const QN_CATEGORIES_DATA: Record<McqCategory, McqCategoryData> = {

   gep: {
      categoryName: "GEP Vocab MCQ",
      setSize: 100,
   },

   phrasalVerbs: {
      categoryName: "Phrasal Verbs Cloze",
      setSize: 50,
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
   }
}

export const DEMO_DATA: { qnNumRange: [number, number], getDemoQnCat: (param: number) => string } = {
   qnNumRange: [1, 61],
   getDemoQnCat(qnNum: number): string {
      let cat: McqCategory;
   
      if (qnNum >= 1 && qnNum <= 10) cat = "phrasalVerbs";
      else if (qnNum >= 11 && qnNum <= 30) cat = "pslePhrasesCloze";
      else if (qnNum >= 31 && qnNum <= 40) cat = "psleWordsCloze";
      else if (qnNum >= 41 && qnNum <= 50) cat = "psleWordsMcq";
      else cat = "psleGrammar";
   
      return QN_CATEGORIES_DATA[cat].categoryName;
   }
}