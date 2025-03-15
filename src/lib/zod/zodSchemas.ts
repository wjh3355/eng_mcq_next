import { z } from "zod";

export const ClozeSchema = z
   .object({
      qnNum: z.number(),
      title: z.string().nonempty(),
      passage: z.string().nonempty(),
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

export const UserAuthDataSchema = z.object({
   email: z.string().email().nonempty(),
   passwordHash: z.string().nonempty(),
   role: z.enum(["user", "admin"]),
   psdResetToken: z.union([z.string().nonempty(), z.null()]),
   psdResetTokenExpiry: z.union([z.string().nonempty(), z.null()]),
   dateCreated: z.string().nonempty(),
   isSuspended: z.boolean(),
}).strict();

const McqCategoryUserDataSchema = z.object({
   numQnsAttempted: z.number(),
   wrongQnNums: z.array(z.number()),
})

export const UserProfileDataSchema = z.object({
   email: z.string().email().nonempty(),
   qnData: z.object({
      gep: McqCategoryUserDataSchema,
      phrasalVerbs: McqCategoryUserDataSchema,
      psleGrammar: McqCategoryUserDataSchema,
      pslePhrasesCloze: McqCategoryUserDataSchema,
      psleWordsCloze: McqCategoryUserDataSchema,
      psleWordsMcq: McqCategoryUserDataSchema,
      spelling: McqCategoryUserDataSchema,
      definition: McqCategoryUserDataSchema,
      demo: McqCategoryUserDataSchema,
      test: McqCategoryUserDataSchema
   }),
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
