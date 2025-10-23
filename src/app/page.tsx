"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import WordCard from "@/components/WordCard";
import Image from "next/image";
import NavBar from "@/components/NavBar";

export default function Home() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const words = useQuery(api.words.getWords) || [];
  const wordsCount = useQuery(api.words.getTotalWordCount) || 0;

  const [query, setQuery] = useState("");

  const filteredWords = words.filter((word) =>
    word.word.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center text-black h-screen overflow-hidden">
      <header className="flex justify-end items-center p-4 gap-4 h-16 w-full max-w-3xl mx-auto">
        <NavBar />
        <SignedOut>
          <SignInButton>
            <Button variant="outline">Sign In</Button>
          </SignInButton>
          <SignUpButton>
            <Button>Sign Up</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div className="flex flex-col justify-center items-center mt-5 w-full max-w-3xl mx-auto px-6">
        <Image src="/logo.png" alt="Lexit Logo" width={100} height={100} />
        {wordsCount && (
          <p className="mt-2 text-gray-600">Total {wordsCount} words</p>
        )}
        <form className="flex my-10 gap-2 w-full">
          <div className="relative flex-1">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="search words"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none bg-gray-100 text-gray-500 text-xs px-1.5 py-0.5 rounded border">
              ⌘K
            </kbd>
          </div>
          <Button type="submit">search</Button>
        </form>
      </div>

      {/* Words List */}
      <div className="w-full max-w-3xl mx-auto max-h-[65vh] overflow-y-auto">
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
        <Button
          size="icon"
          className="rounded-full"
          onClick={() => router.push("/add-word")}
        >
          <Plus size={16} />
        </Button>
      </footer>
    </main>
  );
}
