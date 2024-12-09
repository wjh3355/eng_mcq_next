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
   clozeData: ClozeData
};

export type ClozeData = {
   hasDoneCloze: boolean,
   score: number
}

export const EMPTY_CLOZE_DATA: ClozeData = {
   hasDoneCloze: false,
   score: 0
}

export function makeNewUserDoc(newName: string): UserData {
   return {
      name: newName,
      dateCreated: new Date(),
      qnData: {},
      clozeData: EMPTY_CLOZE_DATA
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
            name: "Random",
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
            href: "/questions/phrasalVerbs/set1"
         },
         {
            qnNumRange: [61, 121],
            name: "Set 2",
            href: "/questions/phrasalVerbs/set2"
         },
         {
            qnNumRange: [121, 181],
            name: "Set 3",
            href: "/questions/phrasalVerbs/set3"
         },
         {
            qnNumRange: [181, 241],
            name: "Set 4",
            href: "/questions/phrasalVerbs/set4"
         },
         {
            qnNumRange: [1, 241],
            name: "Random",
            href: "/questions/phrasalVerbs"
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
            href: "/questions/psleWordsCloze/set1"
         },
         {
            qnNumRange: [51, 101],
            name: "Set 2",
            href: "/questions/psleWordsCloze/set2"
         },
         {
            qnNumRange: [1, 101],
            name: "Random",
            href: "/questions/psleWordsCloze"
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
            href: "/questions/psleWordsMcq/set1"
         },
         {
            qnNumRange: [51, 101],
            name: "Set 2",
            href: "/questions/psleWordsMcq/set2"
         },
         {
            qnNumRange: [1, 101],
            name: "Random",
            href: "/questions/psleWordsMcq"
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
            href: "/questions/pslePhrasesCloze/set1"
         },
         {
            qnNumRange: [51, 101],
            name: "Set 2",
            href: "/questions/pslePhrasesCloze/set2"
         },
         {
            qnNumRange: [101, 151],
            name: "Set 3",
            href: "/questions/pslePhrasesCloze/set3"
         },
         {
            qnNumRange: [151, 201],
            name: "Set 4",
            href: "/questions/pslePhrasesCloze/set4"
         },
         {
            qnNumRange: [201, 251],
            name: "Set 5",
            href: "/questions/pslePhrasesCloze/set5"
         },
         {
            qnNumRange: [251, 301],
            name: "Set 6",
            href: "/questions/pslePhrasesCloze/set6"
         },
         {
            qnNumRange: [301, 351],
            name: "Set 7",
            href: "/questions/pslePhrasesCloze/set7"
         },
         {
            qnNumRange: [1, 351],
            name: "Random",
            href: "/questions/pslePhrasesCloze"
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