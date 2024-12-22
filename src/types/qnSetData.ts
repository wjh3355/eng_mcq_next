export type QnCategory = 
   'gep' | 
   'phrasalVerbs' | 
   'psleWordsCloze' | 
   'psleWordsMcq' | 
   'pslePhrasesCloze' |
   'psleGrammar';

export type QnCategoryData = {
   name: string;
   sets: QnSet[];
}

export type QnSet = {
   qnNumRange: [number, number];
   name: string;
   href: string;
}

export const QN_CATEGORIES_DATA: Record<QnCategory, QnCategoryData> = {

   // debug: {
   //    name: "/Debug/",
   //    isTracked: false,
   //    requiresAuth: true,
   //    requiresAdminAuth: true,
   //    sets: [{
   //       qnNumRange: [1, 6],
   //       name: "?Debug?",
   //       href: "/mcq/sets/debug",
   //    }]
   // },

   // demo: {
   //    name: "Demo MCQ",
   //    isTracked: false,
   //    requiresAuth: false,
   //    requiresAdminAuth: false,
   //    sets: [
   //       {
   //          qnNumRange: [1, 51],
   //          name: "All",
   //          href: "/mcq/sets/demo",
   //       }
   //    ]
   // },

   gep: {
      name: "GEP Vocab MCQ",
      sets: [
         {
            qnNumRange: [1, 101],
            name: "Set 1",
            href: "/mcq/sets/gep/1"
         },
         {
            qnNumRange: [101, 201],
            name: "Set 2",
            href: "/mcq/sets/gep/2"
         },
         {
            qnNumRange: [201, 301],            
            name: "Set 3",
            href: "/mcq/sets/gep/3"
         },
         {
            qnNumRange: [301, 401],            
            name: "Set 4",
            href: "/mcq/sets/gep/4"
         },
         {
            qnNumRange: [401, 501],            
            name: "Set 5",
            href: "/mcq/sets/gep/5"
         },
         {
            qnNumRange: [501, 601],            
            name: "Set 6",
            href: "/mcq/sets/gep/6"
         },
         {
            qnNumRange: [1, 601],
            name: "Random",
            href: "/mcq/sets/gep"
         }
      ]
   },

   phrasalVerbs: {
      name: "Phrasal Verbs Cloze",
      sets: [
         {
            qnNumRange: [1, 51],
            name: "Set 1",
            href: "/mcq/sets/phrasalVerbs/1"
         },
         {
            qnNumRange: [51, 101],
            name: "Set 2",
            href: "/mcq/sets/phrasalVerbs/2"
         },
         {
            qnNumRange: [101, 151],
            name: "Set 3",
            href: "/mcq/sets/phrasalVerbs/3"
         },
         {
            qnNumRange: [151, 201],
            name: "Set 4",
            href: "/mcq/sets/phrasalVerbs/4"
         },
         {
            qnNumRange: [201, 251],
            name: "Set 5",
            href: "/mcq/sets/phrasalVerbs/5"
         },
         {
            qnNumRange: [251, 301],
            name: "Set 6",
            href: "/mcq/sets/phrasalVerbs/6"
         },
         {
            qnNumRange: [1, 301],
            name: "Random",
            href: "/mcq/sets/phrasalVerbs"
         }
      ]
   },

   psleWordsCloze: {
      name: "PSLE Words Cloze",
      sets: [
         {
            qnNumRange: [1, 51],
            name: "Set 1",
            href: "/mcq/sets/psleWordsCloze/1"
         },
         {
            qnNumRange: [51, 101],
            name: "Set 2",
            href: "/mcq/sets/psleWordsCloze/2"
         },
         {
            qnNumRange: [1, 101],
            name: "Random",
            href: "/mcq/sets/psleWordsCloze"
         }
      ]
   },

   psleWordsMcq: {
      name: "PSLE Words MCQ",
      sets: [
         {
            qnNumRange: [1, 51],
            name: "Set 1",
            href: "/mcq/sets/psleWordsMcq/1"
         },
         {
            qnNumRange: [51, 101],
            name: "Set 2",
            href: "/mcq/sets/psleWordsMcq/2"
         },
         {
            qnNumRange: [1, 101],
            name: "Random",
            href: "/mcq/sets/psleWordsMcq"
         }
      ]
   },

   pslePhrasesCloze: {
      name: "PSLE Phrases Cloze",
      sets: [
         {
            qnNumRange: [1, 51],
            name: "Set 1",
            href: "/mcq/sets/pslePhrasesCloze/1"
         },
         {
            qnNumRange: [51, 101],
            name: "Set 2",
            href: "/mcq/sets/pslePhrasesCloze/2"
         },
         {
            qnNumRange: [101, 151],
            name: "Set 3",
            href: "/mcq/sets/pslePhrasesCloze/3"
         },
         {
            qnNumRange: [151, 201],
            name: "Set 4",
            href: "/mcq/sets/pslePhrasesCloze/4"
         },
         {
            qnNumRange: [201, 251],
            name: "Set 5",
            href: "/mcq/sets/pslePhrasesCloze/5"
         },
         {
            qnNumRange: [251, 301],
            name: "Set 6",
            href: "/mcq/sets/pslePhrasesCloze/6"
         },
         {
            qnNumRange: [301, 351],
            name: "Set 7",
            href: "/mcq/sets/pslePhrasesCloze/7"
         },
         {
            qnNumRange: [1, 351],
            name: "Random",
            href: "/mcq/sets/pslePhrasesCloze"
         }
      ]
   },

   psleGrammar: {
      name: "PSLE Grammar MCQ",
      sets: [
         {
            qnNumRange: [1, 51],
            name: "Set 1",
            href: "/mcq/sets/psleGrammar/1"
         },
         {
            qnNumRange: [51, 101],
            name: "Set 2",
            href: "/mcq/sets/psleGrammar/2"
         }
      ]
   }
}

export function findCategoryOfDemoQnNum(qnNum: number): string {
   if (qnNum >= 1 && qnNum <= 20) return QN_CATEGORIES_DATA["phrasalVerbs"].name
   else if (qnNum >= 21 && qnNum <= 30) return QN_CATEGORIES_DATA["pslePhrasesCloze"].name
   else if (qnNum >= 31 && qnNum <= 40) return QN_CATEGORIES_DATA["psleWordsCloze"].name
   else if (qnNum >= 41 && qnNum <= 50) return QN_CATEGORIES_DATA["psleWordsMcq"].name
   else return QN_CATEGORIES_DATA["psleGrammar"].name
}

export type HrefLookupData = {
   cat: QnCategory,
   titleName: string,
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
            titleName: catData.name,
            set
         };
      }
   }
 
   return map;
})();

export const CLOZE_QNNUM_ARR = [1, 2];