import { z } from "zod";
import { CollectionsSchema } from "./qns-cloze-schemas";
import { questionCategoriesTuple } from "@/definitions";

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
}).strict();

export const UserProfileDataSchema = z.object({
   email: z.string().email().nonempty(),
   qnData: z.object({
      gep: McqCategoryUserDataSchema,
      phrasalVerbs: McqCategoryUserDataSchema,
      psleWordsCloze: McqCategoryUserDataSchema,
      psleWordsMcq: McqCategoryUserDataSchema,
      pslePhrasesCloze: McqCategoryUserDataSchema,
      psleGrammar: McqCategoryUserDataSchema,
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
   mockTestData: z.array(
      z.object({
         mockTestNumber: z.number(),
         score: z.number(),
         wrongQuestions: z.array(
            z.object({
               col: CollectionsSchema,
               qnNum: z.number(),
               userWrongAns: z.string()
            })
         ),
         clozeData: z.array(
            z.object({
               blankNum: z.number(),
               ans: z.string(),
               isCorrect: z.boolean()
            })
         )
      })
   ).optional(),
   score: z.number(),
   dateCreated: z.string().nonempty()
})

// may add more fields later, so not .strict()

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
