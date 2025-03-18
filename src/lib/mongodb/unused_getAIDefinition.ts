"use server";

import { AIDefinitionSchema } from "@/lib/zod/user-data-schemas";
import { AIDefinition } from "@/definitions";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function getAIDefinition(wordToDefine: string): Promise<AIDefinition> {
   const res = await openai.beta.chat.completions.parse(
      {
         model: "gpt-4o-mini",
         messages: [
            {
               role: "developer",
               content: `
                  You are an English dictionary API. Your responses should be curated for ~12 year old students.

                  I will input english words/phrases and you are to define them in the format provided.

                  If there are multiple meanings, please provide one set of definitions for each meaning.

                  Always return the word/phrase in title case form.

                  If the word is not a valid English word or phrase, has a typo, or if you encounter any other issue in defining it, please provide an error message (and return an empty array as the definitions). You can decide the error message based on the context, but here are some possible categories to consider:
                  - Request is empty
                  - Non-alphabetical symbols
                  - Not valid English word/phrase
                  - Profanities
                  - Scientific or technical term ("steady-state approximation", "heisenberg uncertainty principle", "positive semi-definite matrix", "hypoglycemic shock"...)
                  - Very long or obscure word ("floccinaucinihilipilification"...)
                  - Did you mean "{insert correct word}"? (for a misspelled word)
                  - Other issues (e.g., ambiguous, unrecognized phrase)

                  If you're unsure, feel free to return a general error message.
               `
            },
            { role: "user", content: wordToDefine }
         ],

         response_format: zodResponseFormat(AIDefinitionSchema, "dictionaryResponse"),

         temperature: 0.4,
         top_p: 1

      }
   );

   const dictResponse = res.choices[0].message;

   if (dictResponse.refusal) {
      return {
         wordToDefine,
         definitions: [],
         errorIfAny: "Request refused by GPT due to " + dictResponse.refusal
      }
   }

   return dictResponse.parsed as AIDefinition;

};