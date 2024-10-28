import { z } from "zod";

export const QnObjSchema = z.object({
   qnNum: z.number(),
   sentence: z.string(),
   wordToTest: z.string().nullable(),
   options: z.array(z.string()),
   correctAns: z.string(),
   rootWord: z.string(),
   type: z.string(),
   def: z.string(),
}).strict();

export const QnObjArrSchema = z.array(QnObjSchema);

export const UserDataSchema = z.record(
   z.enum([
      "demo",
      "gep",
      "phrasalVerbs",
      "psleWordsCloze",
      "psleWordsMcq",
      "pslePhrasesCloze"
   ]),
   z
      .object({
         numQnsAttempted: z.number(),
         wrongQnNums: z.array(z.number()),
      })
      .strict()
);
