"use client";

import React, { useState, useEffect } from "react";
import {
   ClozeProps,
   UserProfileDocument,
} from "@/definitions";
import { fetchCloze } from "@/lib/mongodb/cloze-server-actions";
// import { updateUserProfile } from "@/lib/mongodb/user-server-actions";
import toast from "react-hot-toast";
import { Info } from "lucide-react";
import { updateUserClozeData } from "@/lib/mongodb/user-server-actions";

export default function useClozeProvider({
   user,
   qnNum,
   isDemo,
}: {
   user: UserProfileDocument;
   qnNum: number;
   isDemo: boolean;
}): ClozeProps {

   const [prevUserCorrectAns, setPrevUserCorrectAns] = useState<null | number[]>(null);
   const [passageTitle, setPassageTitle] = useState<string>("");
   const [wordsToTestArr, setWordsToTestArr] = useState<string[][]>([]);
   const [textArr, setTextArr] = useState<string[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(true);

   function handleCompletion(correctAns: number[]) {

      // if demo, do not update user profile (there isnt one, email is empty)
      if (isDemo) {
         setPrevUserCorrectAns(correctAns);
         if (correctAns.length >= 8) {
            toast.success("Hooray! You passed. You may check the correct answers below.");
         } else {
            toast.error("Sorry, you did not pass. You may check the correct answers below.");
         }
         return;
      }

      // if not demo, update user profile with correct answer
      if (correctAns.length >= 8) {
         toast.success("Hooray! You passed. Refresh the page to see the correct answers.");
      } else {
         toast.error("Sorry, you did not pass. Refresh the page to see the correct answers.");
      }

      updateUserClozeData({
         email: user.email,
         clozeNum: qnNum,
         correctAnsArray: correctAns,
      })
      .then(res => {
         if ("error" in res) {
            toast.error(res.error!);
            return;
         }
      });
   }

   function handleReset() {

      // if demo, set prevUserCorrectAns to null
      if (isDemo) {
         setPrevUserCorrectAns(null);
         return;
      }

      // if not demo, update user profile by deleting the cloze entry
      updateUserClozeData({
         email: user.email,
         clozeNum: qnNum,
         correctAnsArray: null,
      })
      .then(
         res => {
            if ("error" in res) {
               toast.error(res.error!);
               return;
            }
            window.location.reload();
         }
      );
   }

   useEffect(() => {

      const fetchData = async() => {
         // if user is attempting demo, an empty user object is passed in --> no cloze data.
         // if not, the actual user object is passed in --> cloze data is present if they have attempted the cloze, else no cloze data.
         const hasUserDoneCloze = user.clozeData.some(cz => cz.qnNum === qnNum);

         if (hasUserDoneCloze) {
            const userDataForThisCloze = user.clozeData.find(cz => cz.qnNum === qnNum)!;
            setPrevUserCorrectAns(userDataForThisCloze.correctAns);
         } else {
            setPrevUserCorrectAns(null);
            toast.custom(
               <span className="border-0 shadow rounded-3 p-3 bg-white fw-bold d-flex align-items-center"> 
                  <Info color="#009300" className="me-1"/>Get at least 8 out of 15 blanks correct to pass.
               </span>
            );
         }

         // fetch cloze based on qnNum
         const clozePromise = fetchCloze(qnNum);

         try {

            // wait for cloze data to be fetched
            const res = await clozePromise;

            // if error, show error message
            if ( "error" in res ) {
               toast.error(res.error!);
               return;
            }

            // match all pairs of curly braces and extract the words to test (joined by "/")
            // split the words by "/" and filter out empty strings
            setWordsToTestArr(
               res.passage
                  .match(/\{[^}]*\}/g)!
                  .map((match) =>
                     match.slice(1, -1).split("/").filter(Boolean)
                  )
            );

            // replace all curly braces with "BLANK"
            // split the passage by "BLANK" and "||" ("||" is used to separate paragraphs)
            // "BLANK" and "||" are included in the split array
            // filter out empty strings
            setTextArr(
               res.passage
                  .replace(/{.*?}/g, "BLANK")
                  .split(/(BLANK|\|\|)/)
                  .filter(Boolean)
            );

            // set the passage title
            setPassageTitle(res.title);

         } catch (err) {
            toast.error(err instanceof Error ? err.message : "An unknown error occurred");
         }

      }

      fetchData();
      
   }, []);

   useEffect(() => {
      // if all data is loaded, set isLoading to false
      // prevent loading spinner from showing when data is already loaded
      if (
         passageTitle.length > 0 &&
         textArr.length > 0 &&
         wordsToTestArr.length > 0
      )
         setIsLoading(false);
   }, [passageTitle, textArr, wordsToTestArr]);

   return {
      isDemo,
      prevUserCorrectAns,
      wordsToTestArr,
      textArr,
      qnNum,
      passageTitle,
      isLoading,
      handleCompletion,
      handleReset,
   };

}