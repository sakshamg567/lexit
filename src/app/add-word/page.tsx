'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ChevronsLeft } from "lucide-react";
import { useState } from "react";
import WordCard from "@/components/WordCard";

const notifySuccess = () => toast.success("Word added successfully!");
const notifyError = (message: string) => toast.error(`Error: ${message}`);

export default function AddWord() {
  const router = useRouter();
  const words = useQuery(api.words.getWords) || [];
  const createWord = useMutation(api.words.createWord);

  const [word, setWord] = useState("");
  const existingWords = words.map(w => w.word.toLowerCase());

  const alreadyExists = existingWords.includes(word.toLowerCase());

  const getWord = useQuery(api.words.getWordByName, word ? { word } : "skip");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!word.trim()) return notifyError("Word cannot be empty");
    if (word.includes(' ')) return notifyError("Word cannot contain spaces");
    if (alreadyExists) return

    try {
      void createWord({
        word,
        meaning: "",
        examples: []
      });
      notifySuccess();
      setWord("")
    } catch (error) {
      notifyError((error as Error).message);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center text-black min-h-screen">
      <div className="mr-auto mx-6">
        <Button variant="outline" className="mb-10" onClick={() => router.push('/')}>
          <ChevronsLeft size={16} />
          Back
        </Button>
      </div>
      <div>
        <h1 className="text-3xl">What new word did you discover?</h1>
        {/* TODO: Did you mean? */}
        <form className="mt-4" onSubmit={handleSubmit}>
          <Input
            type="text"
            name="word"
            placeholder="Enter new word"
            className="mt-5"
            onChange={(e) => { setWord(e.target.value) }}
          />
          <Button type="submit" className="mt-5 w-full">Add Word</Button>
        </form>
      </div>
      {alreadyExists && (
        <div className="flex flex-col mt-5 justify-center items-center">
          <WordCard
            word={getWord?.word || ""}
            meaning={getWord?.meaning || ""}
            examples={getWord?.examples || []}
          />
        </div>
      )}
      <Toaster position="bottom-right" />
    </main>
  )
}
