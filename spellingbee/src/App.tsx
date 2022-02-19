import React from "react";
import {getSpellingBeeSolutions} from './api'
import { useState } from "react";

function App() {
  const [requestState, setRequestState] = useState("init");
  const [words, setWords] = useState<string[]>([]);
  const [mustLetters, setMustLetters] = useState("R");
  const [allowedLetters, setAllowedLetters] = useState("GITAVY");

  const onSearch =  async (e: any) => {
    e.preventDefault();
    setRequestState("loading")
    const res = await getSpellingBeeSolutions(mustLetters, allowedLetters)
    if (res.success) {
      setRequestState("success")
      setWords(res.words)
    } else {
      setRequestState("error")
      setWords([]);
    }
  };

  return (
    <div className="App">
      <header className="text-4xl mb-6">
        Spelling Bee Solver (beta)
        <small className="text-xs block">{"Made by Silvi & Tommy"}</small>
      </header>
      <form onSubmit={onSearch}>
        <div className="grid grid-cols-8 gap-3 w-full">
          <div className="col-span-2 flex flex-col text-left">
            <label className="text-md">Necessary letters</label>
            <input
              value={mustLetters}
              onChange={(e) => setMustLetters(e.target.value)}
              type="text"
              className="w-full p-2 text-sm mt-1 font-bold"
            />
          </div>
          <div className="col-span-4 flex flex-col text-left">
            <label className="text-md">Allowed letters</label>
            <input
              value={allowedLetters}
              onChange={(e) => setAllowedLetters(e.target.value)}
              type="text"
              className="w-full p-2 text-sm mt-1 font-bold"
            />
          </div>
          <button className="bg-white mt-7 hover:bg-gray-200 col-span-2">
            Search
          </button>
        </div>
      </form>
      <div className="mt-8">
        <div className="text-xl">
          {requestState === "success" && words.length > 0 && ` ${words.length} Solutions`}
        </div>
        <div className="text-xl">
          {requestState === "error" && "Sorry an error occurred."}
        </div>
        <div className="text-xl">
          {requestState === "loading" && "Loading..."}
        </div>
        <ol className="flex flex-wrap">
          {words.map(w => {
            return <li className="bg-white mr-2 mt-2 p-2" key={w}>{w}</li>
          })}
        </ol>
      </div>
    </div>
  );
}

export default App;
