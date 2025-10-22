'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import WordCard from "@/components/WordCard";

export default function Home() {
  const words = useQuery(api.words.getWords) || [];
  const [query, setQuery] = useState("");

  const filteredWords = words.filter(word => word.word.toLowerCase().includes(query.toLowerCase()));

  const handleAdd = () => {
    redirect('/add-word');
  }

  return (
    <main className="flex flex-col items-center justify-center text-black min-h-screen">

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
      <div className="w-full max-h-[65vh] overflow-y-auto">
        {filteredWords.length > 0 ? (
          <ul>
            {filteredWords.map((word) => (
              <WordCard
                key={word.word}
                word={word.word}
                meaning={word.meaning}
                examples={word.examples}
              />

            ))}
          </ul>
        ) : (
          <p>No words found.</p>
        )}
      </div>


      {/* Footer */}
      <footer className="mt-auto mb-10 ml-auto mx-5">
        <Button size="icon" className="rounded-full" onClick={handleAdd}>
          <Plus size={16} />
        </Button>
      </footer>
    </main>
  );
}
