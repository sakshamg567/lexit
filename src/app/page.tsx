'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const words = ["example", "test", "sample"];
  const [query, setQuery] = useState("");

  const filteredWords = words.filter(word => word.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="flex flex-col items-center justify-center text-black">

      <div className="flex flex-col justify-center items-center mt-10 w-full">
        <h1 className="text-2xl italic">Welcome to <span className="font-bold">Lexit</span></h1>
        <form className="flex my-10 gap-2 w-[80%]">
          <Input
            type="text"
            placeholder="search words"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit">search</Button>
        </form>
      </div>

      {/* Words List */}
      <div>
        {filteredWords.length > 0 ? (
          <ul>
            {filteredWords.map((word, index) => (
              <li key={index} className="my-2">{word}</li>
            ))}
          </ul>
        ) : (
          <p>No words found.</p>
        )}
      </div>


    </main>
  );
}
