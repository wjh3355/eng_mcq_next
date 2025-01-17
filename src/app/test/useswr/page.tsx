"use client";

import axios from "axios";
import useSWR from "swr";

const apiKey = "b6152ad9d8914e24b1e120932251301";
const query = "Singapore";
const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function Page() {
   const { data, error, isLoading } = useSWR(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}`, fetcher);

   if (error) return <p>Error!</p>;
   if (isLoading) return <p>Loading...</p>;
   
   return <p>{JSON.stringify(data)}</p>;
}