import { QnCategoriesType, QnSetIntervalsType } from "./types";

const qnSetIntervals: Record<QnCategoriesType, QnSetIntervalsType> = {
   demo: [
      {
         slug: undefined,
         displayedName: "Demo Qns",
         qnNumRange: [1, 51]
      }
   ],
   gep: [
      {
         slug: undefined,
         displayedName: "All Qns",
         qnNumRange: [1, 601],
      },
      {
         slug: "set1",
         displayedName: "Set 1",
         qnNumRange: [1, 101],
      },
      {
         slug: "set2",
         displayedName: "Set 2",
         qnNumRange: [101, 201],
      },
      {
         slug: "set3",
         displayedName: "Set 3",
         qnNumRange: [201, 301],
      },
      {
         slug: "set4",
         displayedName: "Set 4",
         qnNumRange: [301, 401],
      },
      {
         slug: "set5",
         displayedName: "Set 5",
         qnNumRange: [401, 501],
      },
      {
         slug: "set6",
         displayedName: "Set 6",
         qnNumRange: [501, 601],
      }
   ],
   phrasal_verbs: [
      {
         slug: undefined,
         displayedName: "All Qns",
         qnNumRange: [1, 241],
      },
      {
         slug: "set1",
         displayedName: "Set 1",
         qnNumRange: [1, 61],
      },
      {
         slug: "set2",
         displayedName: "Set 2",
         qnNumRange: [61, 121],
      },
      {
         slug: "set3",
         displayedName: "Set 3",
         qnNumRange: [121, 181]
      },
      {
         slug: "set4",
         displayedName: "Set 4",
         qnNumRange: [181, 241]
      }
   ],
   psle_words_cloze: [
      {
         slug: undefined,
         displayedName: "All Qns",
         qnNumRange: [1, 101],
      },
      {
         slug: "set1",
         displayedName: "Set 1",
         qnNumRange: [1, 51],
      },
      {
         slug: "set2",
         displayedName: "Set 2",
         qnNumRange: [51, 101],
      }
   ],
   psle_words_mcq: [
      {
         slug: undefined,
         displayedName: "All Qns",
         qnNumRange: [1, 101],
      },
      {
         slug: "set1",
         displayedName: "Set 1",
         qnNumRange: [1, 51],
      },
      {
         slug: "set2",
         displayedName: "Set 2",
         qnNumRange: [51, 101],
      }
   ],
   psle_phrases_cloze: [
      {
         slug: undefined,
         displayedName: "All Qns",
         qnNumRange: [1, 41],
      }
   ]
};

export default qnSetIntervals;