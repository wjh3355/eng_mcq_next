import { QnCategoriesType, NavLinksArrayType } from "./types"

const navLinksArrays: Record<QnCategoriesType, NavLinksArrayType> = {
   demo: [],
   gep: [
      {
         displayedName: "Set 1",
         linksTo: "/gep/set1" 
      },
      {
         displayedName: "Set 2",
         linksTo: "/gep/set2"
      },
      {
         displayedName: "Set 3",
         linksTo: "/gep/set3"
      },
      {
         displayedName: "Set 4",
         linksTo: "/gep/set4"
      },
      {
         displayedName: "Set 5",
         linksTo: "/gep/set5"
      },
      {
         displayedName: "Set 6",
         linksTo: "/gep/set6"
      },
      {
         displayedName: "Complete",
         linksTo: "/gep"
      },
   ],
   phrasal_verbs: [
      {
         displayedName: "Set 1",
         linksTo: "/phrasal_verbs/set1" 
      },
      {
         displayedName: "Set 2",
         linksTo: "/phrasal_verbs/set2"
      },
      {
         displayedName: "Set 3",
         linksTo: "/phrasal_verbs/set3"
      },
      {
         displayedName: "Set 4",
         linksTo: "/phrasal_verbs/set4"
      },
      {
         displayedName: "Complete",
         linksTo: "/phrasal_verbs"
      },
   ],
   psle_words_cloze: [
      {
         displayedName: "Set 1",
         linksTo: "/psle/words/cloze/set1" 
      },
      {
         displayedName: "Set 2",
         linksTo: "/psle/words/cloze/set2"
      },
      {
         displayedName: "Complete",
         linksTo: "/psle/words/cloze"
      },
   ],
   psle_words_mcq: [
      {
         displayedName: "Set 1",
         linksTo: "/psle/words/mcq/set1" 
      },
      {
         displayedName: "Set 2",
         linksTo: "/psle/words/mcq/set2"
      },
      {
         displayedName: "Complete",
         linksTo: "/psle/words/mcq"
      },
   ],
   psle_phrases_cloze: [
      {
         displayedName: "Complete",
         linksTo: "/psle/phrases/cloze" 
      }
   ]
}

export default navLinksArrays;