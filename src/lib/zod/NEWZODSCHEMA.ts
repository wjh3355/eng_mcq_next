import { z } from "zod";

// there are 4 types of questions: meaning, spelling, definition, blank

// nullable: wordToTest, options, rootWord

// meaning: 
// no properties are null
// wordToTest must be in sentence
// correctAns must be in options
// options must be unique
// {
//    "kindOfQn": "meaning",
//    "qnNum": 1,
//    "sentence": "The Taj Mahal has been threatened by pollution, unabashed construction, and a crematorium.",
//    "wordToTest": "unabashed",
//    "options": ["continuous", "illegal", "unplanned", "brazen"],
//    "correctAns": "brazen",
//    "rootWord": "unabashed",
//    "type": "adj",
//    "def": "without any worry about possible criticism or embarrassment"
// },

// spelling:
// only options and rootWord are null
// wordToTest must be in sentence
// {
//    "kindOfQn": "spelling",
//    "qnNum": 2,
//    "sentence": "The silence of the countryside was almost tanjibel.",
//    "wordToTest": "tanjibel",
//    "options": null,
//    "correctAns": "tangible",
//    "rootWord": null,
//    "type": "spelling error",
//    "def": "tangible - real and not imaginary; able to be shown, touched, or experienced"
// },

// definition:
// only wordToTest and rootWord are null
// correctAns must be in options
// options must be unique
// {
//    "kindOfQn": "definition",
//    "qnNum": 1,
//    "sentence": "I stepped into my skis and shuffled to the edge of the steep slope.",
//    "wordToTest": null,
//    "options": ["swagger", "shuffle", "stagger", "sway"],
//    "correctAns": "shuffle",
//    "rootWord": null,
//    "type": "verb",
//    "def": "to walk slowly without lifting one's feet completely off the ground"
// },

// blank:
// only wordToTest is null
// correctAns must be in options
// options must be unique
// {
//    "kindOfQn": "blank",
//    "qnNum": 1,
//    "sentence": "Local authorities have been forced to __________ expenditure.",
//    "wordToTest": null,
//    "options": ["cut off", "cut out for", "cut in", "cut back on"],
//    "correctAns": "cut back on",
//    "rootWord": "cut back on",
//    "type": "phrasal verb",
//    "def": "to reduce the amount or quantity of sth, esp. expenditure"
// },

export const QuestionSchema = z
   .object({
      kindOfQn: z.enum(["meaning", "spelling", "definition", "blank"]),
      qnNum: z.number(),
      sentence: z.string().nonempty(),
      wordToTest: z.union([
         z.string().nonempty(),
         z.null()
      ]),
      options: z.union([
         z.array(z.string().nonempty()).length(4),
         z.null(),
      ]),
      correctAns: z.string().nonempty(),
      rootWord: z.union([
         z.string().nonempty(),
         z.null(),
      ]),
      type: z.string().nonempty(),
      def: z.string().nonempty(),
   })

   .strict()

   .refine((data) => {
      if (data.kindOfQn !== "meaning") return true;
      
      return (
         data.wordToTest !== null &&
         data.sentence.includes(data.wordToTest) &&
         data.options !== null &&
         new Set(data.options).size === 4 &&
         data.rootWord !== null
      )
   }, {
      message: "meaning question is wrongly typed",
   })
   .refine((data) => {
      if (data.kindOfQn !== "spelling") return true;

      return (
         data.wordToTest !== null &&
         data.sentence.includes(data.wordToTest) &&
         data.options === null &&
         data.rootWord === null
      )
   }, {
      message: "spelling question is wrongly typed",
   })
   .refine((data) => {
      if (data.kindOfQn !== "definition") return true;

      return (
         data.options !== null &&
         new Set(data.options).size === 4 &&
         data.wordToTest === null &&
         data.rootWord === null
      )
   }, {
      message: "definition question is wrongly typed",
   })
   .refine((data) => {
      if (data.kindOfQn !== "blank") return true;

      return (
         data.wordToTest === null &&
         data.options !== null &&
         new Set(data.options).size === 4 && 
         data.rootWord !== null
      )
   }, {
      message: "blank question is wrongly typed",
   });