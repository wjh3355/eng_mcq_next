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

export const SpellingObjSchema = z
   .object({
      qnNum: z.number(),
      sentence: z.string().regex(/\[[^\[\]]+\]/),
      correctAns: z.string(),
      type: z.string(),
      exp: z.string(),
   })
   .strict();

export const UserAuthDataSchema = z.object({
   email: z.string().email().nonempty(),
   passwordHash: z.string().nonempty(),
   role: z.enum(["user", "admin"]),
   psdResetToken: z.union([z.string().nonempty(), z.null()]),
   psdResetTokenExpiry: z.union([z.string().nonempty(), z.null()]),
   dateCreated: z.string().nonempty(),
   isSuspended: z.boolean(),
}).strict();

export const UserProfileDataSchema = z.object({
   email: z.string().email().nonempty(),
   qnData: z.record(
      z.object({
         numQnsAttempted: z.number(),
         wrongQnNums: z.array(z.number())
      })
   ),
   clozeData: z.array(
      z.object({
         qnNum: z.number(),
         correctAns: z.array(z.number())
      })
   ),
   score: z.number(),
   dateCreated: z.string().nonempty(),
}).strict()

export const UserInviteSchema = z.object({
   email: z.string().email().nonempty(),
   token: z.string().nonempty(),
   dateCreated: z.string().nonempty(),
}).strict()

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
