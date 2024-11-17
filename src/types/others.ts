export type CurrentQnCategoriesTracked = 
   'gep' | 
   'phrasalVerbs' | 
   'psleWordsCloze' | 
   'psleWordsMcq' | 
   'pslePhrasesCloze';

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

export type UserData = {
   name: string;
   dateCreated: Date;
   qnData: Partial<Record<
      CurrentQnCategoriesTracked,
      {
         numQnsAttempted: number;
         wrongQnNums: number[];
      }
   >>;
};

export function makeNewUserDoc(name: string): UserData {
   return {
      name,
      dateCreated: new Date(),
      qnData: {}
   };
};

export const QN_CATEGORIES_DATA: Record<CurrentQnCategories, QnCategoryData> = {

   debug: {
      name: "qaz",
      isTracked: false,
      requiresAuth: true,
      requiresAdminAuth: true,
      sets: [{
         qnNumRange: [1, 6],
         name: "qux",
         href: "/questions/debug",
      }]
   },

   demo: {
      name: "spam",
      isTracked: false,
      requiresAuth: false,
      requiresAdminAuth: false,
      sets: [
         {
            qnNumRange: [1, 51],
            name: "eggs",
            href: "/questions/demo",
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
            href: "/questions/gep/set1"
         },
         {
            qnNumRange: [101, 201],
            name: "Set 2",
            href: "/questions/gep/set2"
         },
         {
            qnNumRange: [201, 301],            
            name: "Set 3",
            href: "/questions/gep/set3"
         },
         {
            qnNumRange: [301, 401],            
            name: "Set 4",
            href: "/questions/gep/set4"
         },
         {
            qnNumRange: [401, 501],            
            name: "Set 5",
            href: "/questions/gep/set5"
         },
         {
            qnNumRange: [501, 601],            
            name: "Set 6",
            href: "/questions/gep/set6"
         },
         {
            qnNumRange: [1, 601],
            name: "All Questions",
            href: "/questions/gep"
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
            href: "/questions/phrasal_verbs/set1"
         },
         {
            qnNumRange: [61, 121],
            name: "Set 2",
            href: "/questions/phrasal_verbs/set2"
         },
         {
            qnNumRange: [121, 181],
            name: "Set 3",
            href: "/questions/phrasal_verbs/set3"
         },
         {
            qnNumRange: [181, 241],
            name: "Set 4",
            href: "/questions/phrasal_verbs/set4"
         },
         {
            qnNumRange: [1, 241],
            name: "All Questions",
            href: "/questions/phrasal_verbs"
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
            href: "/questions/psle/words/cloze/set1"
         },
         {
            qnNumRange: [51, 101],
            name: "Set 2",
            href: "/questions/psle/words/cloze/set2"
         },
         {
            qnNumRange: [1, 101],
            name: "All Questions",
            href: "/questions/psle/words/cloze"
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
            href: "/questions/psle/words/mcq/set1"
         },
         {
            qnNumRange: [51, 101],
            name: "Set 2",
            href: "/questions/psle/words/mcq/set2"
         },
         {
            qnNumRange: [1, 101],
            name: "All Questions",
            href: "/questions/psle/words/mcq"
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
            href: "/questions/psle/phrases/cloze/set1"
         },
         {
            qnNumRange: [51, 101],
            name: "Set 2",
            href: "/questions/psle/phrases/cloze/set2"
         },
         {
            qnNumRange: [101, 151],
            name: "Set 3",
            href: "/questions/psle/phrases/cloze/set3"
         },
         {
            qnNumRange: [151, 201],
            name: "Set 4",
            href: "/questions/psle/phrases/cloze/set4"
         },
         {
            qnNumRange: [201, 251],
            name: "Set 5",
            href: "/questions/psle/phrases/cloze/set5"
         },
         {
            qnNumRange: [251, 301],
            name: "Set 6",
            href: "/questions/psle/phrases/cloze/set6"
         },
         {
            qnNumRange: [301, 351],
            name: "Set 7",
            href: "/questions/psle/phrases/cloze/set7"
         },
         {
            qnNumRange: [1, 351],
            name: "All Questions",
            href: "/questions/psle/phrases/cloze"
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