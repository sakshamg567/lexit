"use client";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import WordCard from "@/components/WordCard";
import AlphabetFilter from "@/components/AlphabetFilter";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Vault() {
  const router = useRouter();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const { user } = useUser();
  const userWord =
    useQuery(api.words.getUserWord, {
      owner: user ? user.id : "",
    }) || null;

  const isOwner = (ownerId: string) => {
    if (ownerId === user?.id) return true;
    return false;
  };

  // Filter words based on selected letter
  const filteredWords = userWord
    ? userWord.filter((word) => {
        if (selectedLetter === null) return true;
        return word.word.charAt(0).toUpperCase() === selectedLetter;
      })
    : [];

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
        <h1 className="text-2xl font-bold">Word Vault</h1>
        {user && (
          <p className="mt-2 mb-4 text-gray-600">
            Welcome, {user.firstName}! Here are your saved words.
          </p>
        )}

        {/* Words List */}
        <div className="w-full max-w-3xl mx-auto max-h-[65vh] overflow-y-auto">
          {filteredWords && filteredWords.length > 0 ? (
            <ul>
              {filteredWords.reverse().map((word) => (
                <WordCard
                  key={word.word}
                  word={word.word}
                  meaning={word.meaning}
                  examples={word.examples}
                  isOwner={isOwner(word.owner || "")}
                />
              ))}
            </ul>
          ) : (
            <p className="flex items-center justify-center">
              {selectedLetter
                ? `No words found starting with "${selectedLetter}".`
                : "No words found."}
            </p>
          )}
        </div>

        {/* Alphabet Filter */}
        {userWord && userWord.length > 0 && (
          <AlphabetFilter
            words={userWord}
            selectedLetter={selectedLetter}
            onLetterSelect={setSelectedLetter}
          />
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
