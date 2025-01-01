export type QnCategory = 
   'gep' | 
   'phrasalVerbs' | 
   'psleWordsCloze' | 
   'psleWordsMcq' | 
   'pslePhrasesCloze' |
   'psleGrammar';

export type QnCategoryData = {
   categoryName: string;
   sets: QnSet[];
}

export type QnSet = {
   qnNumRange: [number, number];
   setName: string;
   href: string;
}

export const QN_CATEGORIES_DATA: Record<QnCategory, QnCategoryData> = {

   gep: {
      categoryName: "GEP Vocab MCQ",
      sets: [
         {
            qnNumRange: [1, 101],
            setName: "Set 1",
            href: "/mcq/sets/gep/1"
         },
         {
            qnNumRange: [101, 201],
            setName: "Set 2",
            href: "/mcq/sets/gep/2"
         },
         {
            qnNumRange: [201, 301],            
            setName: "Set 3",
            href: "/mcq/sets/gep/3"
         },
         {
            qnNumRange: [301, 401],            
            setName: "Set 4",
            href: "/mcq/sets/gep/4"
         },
         {
            qnNumRange: [401, 501],            
            setName: "Set 5",
            href: "/mcq/sets/gep/5"
         },
         {
            qnNumRange: [501, 601],            
            setName: "Set 6",
            href: "/mcq/sets/gep/6"
         },
         {
            qnNumRange: [1, 601],
            setName: "Random",
            href: "/mcq/sets/gep"
         }
      ]
   },

   phrasalVerbs: {
      categoryName: "Phrasal Verbs Cloze",
      sets: [
         {
            qnNumRange: [1, 51],
            setName: "Set 1",
            href: "/mcq/sets/phrasalVerbs/1"
         },
         {
            qnNumRange: [51, 101],
            setName: "Set 2",
            href: "/mcq/sets/phrasalVerbs/2"
         },
         {
            qnNumRange: [101, 151],
            setName: "Set 3",
            href: "/mcq/sets/phrasalVerbs/3"
         },
         {
            qnNumRange: [151, 201],
            setName: "Set 4",
            href: "/mcq/sets/phrasalVerbs/4"
         },
         {
            qnNumRange: [201, 251],
            setName: "Set 5",
            href: "/mcq/sets/phrasalVerbs/5"
         },
         {
            qnNumRange: [251, 301],
            setName: "Set 6",
            href: "/mcq/sets/phrasalVerbs/6"
         },
         {
            qnNumRange: [1, 301],
            setName: "Random",
            href: "/mcq/sets/phrasalVerbs"
         }
      ]
   },

   psleWordsCloze: {
      categoryName: "PSLE Words Cloze",
      sets: [
         {
            qnNumRange: [1, 51],
            setName: "Set 1",
            href: "/mcq/sets/psleWordsCloze/1"
         },
         {
            qnNumRange: [51, 101],
            setName: "Set 2",
            href: "/mcq/sets/psleWordsCloze/2"
         },
         {
            qnNumRange: [1, 101],
            setName: "Random",
            href: "/mcq/sets/psleWordsCloze"
         }
      ]
   },

   psleWordsMcq: {
      categoryName: "PSLE Words MCQ",
      sets: [
         {
            qnNumRange: [1, 51],
            setName: "Set 1",
            href: "/mcq/sets/psleWordsMcq/1"
         },
         {
            qnNumRange: [51, 101],
            setName: "Set 2",
            href: "/mcq/sets/psleWordsMcq/2"
         },
         {
            qnNumRange: [1, 101],
            setName: "Random",
            href: "/mcq/sets/psleWordsMcq"
         }
      ]
   },

   pslePhrasesCloze: {
      categoryName: "PSLE Phrases Cloze",
      sets: [
         {
            qnNumRange: [1, 51],
            setName: "Set 1",
            href: "/mcq/sets/pslePhrasesCloze/1"
         },
         {
            qnNumRange: [51, 101],
            setName: "Set 2",
            href: "/mcq/sets/pslePhrasesCloze/2"
         },
         {
            qnNumRange: [101, 151],
            setName: "Set 3",
            href: "/mcq/sets/pslePhrasesCloze/3"
         },
         {
            qnNumRange: [151, 201],
            setName: "Set 4",
            href: "/mcq/sets/pslePhrasesCloze/4"
         },
         {
            qnNumRange: [201, 251],
            setName: "Set 5",
            href: "/mcq/sets/pslePhrasesCloze/5"
         },
         {
            qnNumRange: [251, 301],
            setName: "Set 6",
            href: "/mcq/sets/pslePhrasesCloze/6"
         },
         {
            qnNumRange: [301, 351],
            setName: "Set 7",
            href: "/mcq/sets/pslePhrasesCloze/7"
         },
         {
            qnNumRange: [351, 401],
            setName: "Set 8",
            href: "/mcq/sets/pslePhrasesCloze/8"
         },
         {
            qnNumRange: [401, 451],
            setName: "Set 9",
            href: "/mcq/sets/pslePhrasesCloze/9"
         },
         {
            qnNumRange: [451, 501],
            setName: "Set 10",
            href: "/mcq/sets/pslePhrasesCloze/10"
         },
         {
            qnNumRange: [1, 501],
            setName: "Random",
            href: "/mcq/sets/pslePhrasesCloze"
         }
      ]
   },

   psleGrammar: {
      categoryName: "PSLE Grammar MCQ",
      sets: [
         {
            qnNumRange: [1, 51],
            setName: "Set 1",
            href: "/mcq/sets/psleGrammar/1"
         },
         {
            qnNumRange: [51, 101],
            setName: "Set 2",
            href: "/mcq/sets/psleGrammar/2"
         },
         {
            qnNumRange: [1, 101],
            setName: "Random",
            href: "/mcq/sets/psleGrammar"
         }
      ]
   }
}

export const DEMO_DATA: { qnNumRange: [number, number], getDemoQnCat: (param: number) => string } = {
   qnNumRange: [1, 61],
   getDemoQnCat(qnNum: number): string {
      let cat: QnCategory;
   
      if (qnNum >= 1 && qnNum <= 10) cat = "phrasalVerbs";
      else if (qnNum >= 11 && qnNum <= 30) cat = "pslePhrasesCloze";
      else if (qnNum >= 31 && qnNum <= 40) cat = "psleWordsCloze";
      else if (qnNum >= 41 && qnNum <= 50) cat = "psleWordsMcq";
      else cat = "psleGrammar";
   
      return QN_CATEGORIES_DATA[cat].categoryName;
   }
}

export type HrefLookupData = {
   cat: QnCategory,
   categoryName: string,
   set: QnSet
}

export const HREF_LOOKUP_MAP: Record<string, HrefLookupData> = (() => {
   const map: Record<string, HrefLookupData> = {};

   for (const cat in QN_CATEGORIES_DATA) {
      const cat2 = cat as QnCategory
      const catData = QN_CATEGORIES_DATA[cat2];

      for (const set of catData.sets) {
         map[set.href] = {
            cat: cat2,
            categoryName: catData.categoryName,
            set
         };
      }
   }
 
   return map;
})();

export const CLOZE_QNNUM_ARR = [1, 2];