"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ChevronsLeft, LoaderPinwheel } from "lucide-react";
import { useEffect, useState } from "react";
import WordCard from "@/components/WordCard";

const notifySuccess = () => toast.success("Word added successfully!");
const notifyError = (message: string) => toast.error(`${message}`);

export default function AddWord() {
  const router = useRouter();

  const words = useQuery(api.words.getWords) || [];
  const createWord = useMutation(api.words.createWord);
  const updateCount = useMutation(api.words.updateCount);

  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [examples, setExamples] = useState<string[]>([]);

  const [debouncedWord, setDebouncedWord] = useState(word);
  const [AIDebouncedWord, setAIDebouncedWord] = useState(word);

  const [meaningExists, setMeaningExists] = useState(false);
  const [meaningLoading, setMeaningLoading] = useState(false);
  const [examplesLoading, setExamplesLoading] = useState(false);

  useEffect(() => {
    setMeaning("");
    setExamples([]);

    const convexSearch = setTimeout(() => {
      setDebouncedWord(word);
    }, 500);

    const aiSearch = setTimeout(() => {
      setAIDebouncedWord(word);
    }, 2000);

    return () => {
      (clearTimeout(convexSearch), clearTimeout(aiSearch));
    };
  }, [word]);

  useEffect(() => {
    if (!AIDebouncedWord || meaningExists) return;

    const fetchMeaning = async () => {
      try {
        setMeaningLoading(true);
        const res = await fetch("/api/generate-meaning", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ word: AIDebouncedWord }),
        });

        if (!res.ok) throw new Error("Failed to generate meaning");
        const data = await res.json();
        setMeaning(data.definition);
      } catch (error) {
        notifyError((error as Error).message);
      } finally {
        setMeaningLoading(false);
      }
    };

    const fetchExamples = async () => {
      try {
        setExamplesLoading(true);
        const res = await fetch("/api/generate-examples", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ word: AIDebouncedWord }),
        });

        if (!res.ok) throw new Error("Failed to generate examples");
        const data = await res.json();
        setExamples(data.examples);
      } catch (error) {
        notifyError((error as Error).message);
      } finally {
        setExamplesLoading(false);
      }
    };

    fetchMeaning();
    fetchExamples();
  }, [AIDebouncedWord]);

  const existingWords = words.map((w) => w.word.toLowerCase());
  const alreadyExists = existingWords.includes(word.toLowerCase());

  useEffect(() => {
    if (!word.trim() || !alreadyExists) {
      setMeaningExists(false);
    } else if (alreadyExists) {
      setMeaningExists(true);
    }
  }, [alreadyExists]);

  const getWord = useQuery(
    api.words.getWordByName,
    debouncedWord ? { word: debouncedWord } : "skip"
  );
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!word.trim()) return notifyError("Word cannot be empty");
    if (word.includes(" ")) return notifyError("Word cannot contain spaces");
    if (alreadyExists) return notifyError("Word already exists");
    if (meaning.trim().length === 0 || examples.length === 0) return notifyError("Sit Tight while AI generates the meaning and examples!");
    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
    try {
      void createWord({
        word: capitalizedWord,
        meaning: meaning,
        examples: examples,
      });
      void updateCount();

      notifySuccess();
      setWord("");
      setMeaningExists(false);
    } catch (error) {
      notifyError((error as Error).message);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center text-black h-screen overflow-hidden">
      <div className="w-full max-w-3xl mx-auto px-6">
        <Button
          variant="outline"
          className="mb-10"
          onClick={() => router.push("/")}
        >
          <ChevronsLeft size={16} />
          Back
        </Button>
      </div>
      <div className="w-full max-w-3xl mx-auto px-6">
        <h1 className="text-3xl">Discovered a word?</h1>
        <form className="mt-1" onSubmit={handleSubmit}>
          <Input
            type="text"
            name="word"
            placeholder="Enter new word"
            className="mt-5"
            value={word}
            onChange={(e) => {
              setWord(e.target.value);
            }}
          />
          {meaning.length > 0 && (
            <section>
              <label className="mt-5 block font-medium text-sm text-gray-700">
                Definition (generated by AI)
              </label>
              <Input
                type="text"
                name="meaning"
                className="mt-2 border-dashed border-2"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
              />
            </section>
          )}
          {meaningLoading && (
            <div className="flex items-center mt-5 text-gray-500">
              <LoaderPinwheel className="animate-spin mr-2" color="#6a7282" />
              <p>Generating definition...</p>
            </div>
          )}
          {examples.length > 0 && (
            <section>
              <label className="mt-5 block font-medium text-sm text-gray-700">
                Example Sentences (generated by AI)
              </label>
              <div className="mt-2 space-y-2">
                {examples.map((example, index) => (
                  <Input
                    key={index}
                    type="text"
                    name={`example-${index}`}
                    className="border-dashed border-2"
                    value={example}
                    readOnly
                  />
                ))}
              </div>
            </section>
          )}
          {examplesLoading && (
            <div className="flex items-center mt-5 text-gray-500">
              <LoaderPinwheel className="animate-spin mr-2" color="#6a7282" />
              <p>Generating example sentences...</p>
            </div>
          )}
          <Button type="submit" className="mt-5 w-full">
            Add Word
          </Button>
        </form>
      </div>
      {alreadyExists && getWord && getWord?.word?.length > 0 && (
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
  );
}
