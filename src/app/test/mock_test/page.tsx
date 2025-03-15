import MockTest from "@/components/mock-test/MockTest";
import React from "react";

export const dynamic = "force-dynamic";

export default function Page() {
   return (
      <MockTest
         questions={{
            "psleGrammar": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            "psleWordsCloze": [1, 2, 3],
            "phrasalVerbs": [1, 2],
            "psleWordsMcq": [1, 2, 3, 4, 5],
            "spelling": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
         }}
         clozeNum={1}
         mockTestNum={1}
      />
   );
}
