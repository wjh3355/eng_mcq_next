"use client";

import { useEffect, useState } from "react";

export default function Page() {
   const [loading, setLoading] = useState(true);
   const [data, setData] = useState<{title: string} | null>(null);

   useEffect(() => {
      async function fetchThing() {
         const res = await fetch("https://jsonplaceholder.typicode.com/todos/5");
         const data = await res.json();
         setData(data);
         setLoading(false);
         console.log(data);
      };

      fetchThing();
   }, []);

   if (loading) return <p>Loading...</p>;

   return <h1 className="font-monospace">{data ? data.title : "aaaaa"}</h1>;
}
