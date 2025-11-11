import useGetLpList from "../hooks/queries/useGetLpList.ts";
import { useState } from "react";

const HomePage = () => { // Show usages new *
  const [search, setSearch]= useState("매튜"); // initialState:
  const { data, isPending, isError } = useGetLpList({ 
    search,
  });

  return (
    <div className={"mt-20"}>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      {data?.data.map((lp) => <h1>{lp.title}</h1>)}
    </div>
  );
};

export default HomePage; // Show usages new *