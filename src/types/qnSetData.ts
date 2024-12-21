export type CurrentQnCategoriesTracked = 
   'gep' | 
   'phrasalVerbs' | 
   'psleWordsCloze' | 
   'psleWordsMcq' | 
   'pslePhrasesCloze' |
   'psleGrammar';

export type CurrentQnCategories = CurrentQnCategoriesTracked | 'demo' | 'debug';

export type QnCategoryData = {
   name: string;
   isTracked: boolean;
   requiresAuth: boolean;
   requiresAdminAuth: boolean;
   sets: QnSet[];
}

export type QnSet = {
   qnNumRange: [number, number];
   name: string;
   href: string;
}

export const QN_CATEGORIES_DATA: Record<CurrentQnCategories, QnCategoryData> = {

   debug: {
      name: "/Debug/",
      isTracked: false,
      requiresAuth: true,
      requiresAdminAuth: true,
      sets: [{
         qnNumRange: [1, 6],
         name: "?Debug?",
         href: "/mcq/sets/debug",
      }]
   },

   demo: {
      name: "Demo MCQ",
      isTracked: false,
      requiresAuth: false,
      requiresAdminAuth: false,
      sets: [
         {
            qnNumRange: [1, 51],
            name: "All",
            href: "/mcq/sets/demo",
         }
      ]
   },

   gep: {
      name: "GEP Vocab MCQ",
      isTracked: true,
      requiresAuth: true,
      requiresAdminAuth: false,
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
      isTracked: true,
      requiresAuth: true,
      requiresAdminAuth: false,
      sets: [
         {
            qnNumRange: [1, 61],
            name: "Set 1",
            href: "/mcq/sets/phrasalVerbs/1"
         },
         {
            qnNumRange: [61, 121],
            name: "Set 2",
            href: "/mcq/sets/phrasalVerbs/2"
         },
         {
            qnNumRange: [121, 181],
            name: "Set 3",
            href: "/mcq/sets/phrasalVerbs/3"
         },
         {
            qnNumRange: [181, 241],
            name: "Set 4",
            href: "/mcq/sets/phrasalVerbs/4"
         },
         {
            qnNumRange: [1, 241],
            name: "Random",
            href: "/mcq/sets/phrasalVerbs"
         }
      ]
   },

   psleWordsCloze: {
      name: "PSLE Words Cloze",
      isTracked: true,
      requiresAuth: true,
      requiresAdminAuth: false,
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
      isTracked: true,
      requiresAuth: true,
      requiresAdminAuth: false,
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
      isTracked: true,
      requiresAuth: true,
      requiresAdminAuth: false,
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
      isTracked: true,
      requiresAuth: true,
      requiresAdminAuth: false,
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

export type HrefLookupData = {
   cat: CurrentQnCategories,
   titleName: string,
   isTracked: boolean,
   requiresAuth: boolean,
   requiresAdminAuth: boolean,
   set: QnSet
}

export const HREF_LOOKUP_MAP: Record<string, HrefLookupData> = (() => {
   const map: Record<string, HrefLookupData> = {};

   for (const cat in QN_CATEGORIES_DATA) {
      const cat2 = cat as CurrentQnCategories
      const catData = QN_CATEGORIES_DATA[cat2];

      for (const set of catData.sets) {
         map[set.href] = { 
            cat: cat2, 
            titleName: catData.name,
            isTracked: catData.isTracked,
            requiresAuth: catData.requiresAuth,
            requiresAdminAuth: catData.requiresAdminAuth,
            set 
         };
      }
   }
 
   return map;
})();

export const CLOZE_QNNUM_ARR = [1, 2];