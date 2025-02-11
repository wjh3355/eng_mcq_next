import { z } from "zod";

export const McqObjSchema = z
   .object({
      qnNum: z.number(),
      sentence: z.string().nonempty(),
      wordToTest: z.union([z.string().nonempty(), z.null()]),
      options: z.array(z.string().nonempty()).length(4),
      correctAns: z.string().nonempty(),
      rootWord: z.string().nonempty(),
      type: z.string().nonempty(),
      def: z.string().nonempty(),
   })
   .strict()
   .refine((data) => data.options.includes(data.correctAns), {
      message: "correctAns not in options",
      path: ["correctAns"],
   })
   .refine((data) => new Set(data.options).size === 4, {
      message: "options must be unique",
      path: ["options"],
   })
   .refine(
      ({ sentence, wordToTest }) =>
         wordToTest !== null ? sentence.includes(wordToTest) : true,
      {
         message: "type is find synonym but wordToTest not in sentence",
      }
   )
   .refine(
      ({ sentence, wordToTest }) =>
         wordToTest === null ? sentence.includes("_") : true,
      {
         message: "type is fill in the blank but sentence does not contain '_'s",
      }
   );

export const McqObjArrSchema = z.array(McqObjSchema);

export const ClozeObjSchema = z
   .object({
      qnNum: z.number(),
      title: z.string(),
      passage: z.string(),
   })
   .strict()
   .refine(
      (data) => {
         const passage = data.passage;

         // Regular expression to find all { ... } pairs in the passage
         const correctAnswers = [...passage.matchAll(/{([^}]*)}/g)].map(
            (match) => match[1]
         );

         // Check if there are exactly 15
         if (correctAnswers.length !== 15) return false;

         for (const correctAnswerString of correctAnswers) {
            if (!correctAnswerString) return false;
            if (correctAnswerString.split("/").some((ans) => !ans))
               return false;
         }

         return true;
      },
      {
         message:
            "The passage must contain exactly 15 pairs of { ... }, each enclosing non-empty answers separated by a /",
         path: ["passage"],
      }
   );

export const ClozeObjArrSchema = z.array(ClozeObjSchema);

export const SpellingObjSchema = z
   .object({
      qnNum: z.number(),
      sentence: z.string().regex(/\[[^\[\]]+\]/),
      correctAns: z.string(),
      type: z.string(),
      exp: z.string(),
   })
   .strict();

export const SpellingObjArrSchema = z.array(SpellingObjSchema);

// export const UserDataSchema = z.object({
//    name: z.string(),
//    dateCreated: z.date(),
//    qnData: z.record(
//       z.enum([
//          "gep",
//          "phrasalVerbs",
//          "psleWordsCloze",
//          "psleWordsMcq",
//          "pslePhrasesCloze"
//       ]),
//       z.object({
//          numQnsAttempted: z.number(),
//          wrongQnNums: z.array(z.number()),
//       }).strict()
//    )
// }).strict();

export const AIDefinitionSchema = z.object({
   wordToDefine: z.string(),
   definitions: z.array(
      z.object({
         type: z.string(),
         def: z.string(),
         sentence: z.string(),
      })
   ),
   errorIfAny: z.string().nullable(),
});
