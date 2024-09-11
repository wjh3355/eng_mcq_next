export const DEMO_AllowedSetConfigs = {
   undefined: {
      range: [1, 41],
      setName: "Demo Qns"
   }
};

export const GEP_VOCAB_AllowedSetConfigs = {
   undefined: {
      range: [1, 601],
      setName: "All Qns",
   },
   set1: {
      range: [1, 101],
      setName: "Set 1",
   },
   set2: {
      range: [101, 201],
      setName: "Set 2",
   },
   set3: {
      range: [201, 301],
      setName: "Set 3",
   },
   set4: {
      range: [301, 401],
      setName: "Set 4",
   },
   set5: {
      range: [401, 501],
      setName: "Set 5",
   },
   set6: {
      range: [501, 601],
      setName: "Set 6",
   }
};

export const PHRASAL_VERBS_AllowedSetConfigs = {
   undefined: {
      range: [1, 241],
      setName: "All Qns",
   },
   set1: {
      range: [1, 61],
      setName: "Set 1",
   },
   set2: {
      range: [61, 121],
      setName: "Set 2",
   },
   set3: {
      range: [121, 181],
      setName: "Set 3"
   },
   set4: {
      range: [181, 241],
      setName: "Set 4"
   }
};

export const PSLE_CLOZE_AllowedSetConfigs = {
   undefined: {
      range: [1, 101],
      setName: "All Qns",
   },
   set1: {
      range: [1, 51],
      setName: "Set 1",
   },
   set2: {
      range: [51, 101],
      setName: "Set 2",
   }
};

export const PSLE_MCQ_AllowedSetConfigs = PSLE_CLOZE_AllowedSetConfigs;

// #######################################################################

export const GEP_VOCAB_navLinksArray = [
   {
      name: "Set 1",
      href: "/gep_vocab/set1" 
   },
   {
      name: "Set 2",
      href: "/gep_vocab/set2"
   },
   {
      name: "Set 3",
      href: "/gep_vocab/set3"
   },
   {
      name: "Set 4",
      href: "/gep_vocab/set4"
   },
   {
      name: "Set 5",
      href: "/gep_vocab/set5"
   },
   {
      name: "Set 6",
      href: "/gep_vocab/set6"
   },
   {
      name: "Complete",
      href: "/gep_vocab"
   },
];

export const PHRASAL_VERBS_navLinksArray = [
   {
      name: "Set 1",
      href: "/phrasal_verbs/set1" 
   },
   {
      name: "Set 2",
      href: "/phrasal_verbs/set2"
   },
   {
      name: "Set 3",
      href: "/phrasal_verbs/set3"
   },
   {
      name: "Set 4",
      href: "/phrasal_verbs/set4"
   },
   {
      name: "Complete",
      href: "/phrasal_verbs"
   },
];

export const PSLE_CLOZE_navLinksArray = [
   {
      name: "Set 1",
      href: "/psle_words/cloze/set1" 
   },
   {
      name: "Set 2",
      href: "/psle_words/cloze/set2"
   },
   {
      name: "Complete",
      href: "/psle_words/cloze"
   },
];

export const PSLE_MCQ_navLinksArray = [
   {
      name: "Set 1",
      href: "/psle_words/mcq/set1" 
   },
   {
      name: "Set 2",
      href: "/psle_words/mcq/set2"
   },
   {
      name: "Complete",
      href: "/psle_words/mcq"
   },
];