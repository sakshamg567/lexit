'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import WordCard from "@/components/WordCard";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const words = useQuery(api.words.getWords) || [];
  const [query, setQuery] = useState("");

  const filteredWords = words.filter(word => word.word.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="flex flex-col items-center justify-center text-black min-h-screen">

      <div className="flex flex-col justify-center items-center mt-5 w-full">
        <Image
          src="/logo.png"
          alt="Lexit Logo"
          width={100}
          height={100}
        />
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
            {filteredWords.reverse().map((word) => (
              <WordCard
                key={word.word}
                word={word.word}
                meaning={word.meaning}
                examples={word.examples}
              />

            ))}
          </ul>
        ) : (
          <p className="flex items-center justify-center">No words found.</p>
        )}
      </div>


      {/* Footer */}
      <footer className="mt-auto mb-10 ml-auto mx-5">
        <Button size="icon" className="rounded-full" onClick={() => router.push("/add-word")}>
          <Plus size={16} />
        </Button>
      </footer>
    </main>
  );
}
