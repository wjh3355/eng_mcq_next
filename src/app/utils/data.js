import { sql } from "@vercel/postgres";
// import fs from "fs/promises";

export async function fetchQnJson(qnNum) {

   try {
      const result = await fetch('https://gist.githubusercontent.com/wjh3355/0044ee12436ff44915daf15e45622ef2/raw/567e2f20b85ec7eb7a501ac942a9df2387aca2d2/source.json');
      const data = await result.json();
      const qnObj = data[qnNum-1];

      return qnObj;
   } catch(error) {
      console.log('Error when fetching questions using json:', error);
      return;
   }
}


export async function fetchQnSql(qnNum) {

   try {
      const result = await sql`
         SELECT * FROM questions WHERE qnNum = ${qnNum};
      `;
      const qnObj = result.rows[0];

      return qnObj;
   } catch (error) {
      console.error('Error when fetching question using postgres:', error);
      return;
   }
};

// THIS IS NOT NEEDED ANYMORE FOR NOW!

export async function seed() {

   try {

      const data = await fs.readFile('source.json', 'utf-8');
      const qnArray = JSON.parse(data);

      /* await sql`
         CREATE TABLE questions (
            qnNum INTEGER PRIMARY KEY NOT NULL,
            sentence TEXT NOT NULL,
            wordToTest TEXT NOT NULL,
            options TEXT[] NOT NULL,
            correctAns TEXT NOT NULL,
            rootWord TEXT NOT NULL,
            type TEXT NOT NULL,
            def TEXT NOT NULL
         );
      `; */

      qnArray.map(async qnObj => {
         const { qnNum, sentence, wordToTest, options, correctAns, rootWord, type, def } = qnObj;
         await sql`
         
            INSERT INTO 
               questions (qnNum, sentence, wordToTest, options, correctAns, rootWord, type, def) 
            VALUES 
               (${qnNum}, ${sentence}, ${wordToTest}, ${options}, ${correctAns}, ${rootWord}, ${type}, ${def});
         
         `;
      });

      console.log('table created and seeded!!!');

   } catch (error) {
      console.error('Error:', error);
      return new Response('Error', { status: 500 });
   }
}

