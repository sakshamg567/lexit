"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ChevronsLeft, LoaderPinwheel } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import WordCard from "@/components/WordCard";
import { useUser } from "@clerk/nextjs";

const notifySuccess = () => toast.success("Word added successfully!");
const notifyError = (message: string) => toast.error(`${message}`);

export default function AddWord() {
  const router = useRouter();
  const wordInputRef = useRef<HTMLInputElement>(null);

  const { user } = useUser();

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
  const [greeting, setGreeting] = useState("");

  const greetings = [
    "Discovered a new word? Let's define it!",
    "Found a word no one knows? Add it here!",
    "Help us grow the dictionary! Submit your word.",
    "Got a rare word? Share its meaning!",
    "What did you come across?",
  ]

  useEffect(() => {
    const random = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(random);
  }, [])

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
    if (meaning.trim().length === 0 || examples.length === 0)
      return notifyError(
        "Sit Tight while AI generates the meaning and examples!"
      );
    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
    try {
      void createWord({
        owner: user?.id || "anonymous",
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

  const isOwner = (ownerId: string) => {
    if (ownerId == user?.id) return true;
    return false;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        wordInputRef.current?.focus();
        return;
      }

      if (e.key === "Escape") {
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          e.target.blur();
        }
        return;
      }

      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        wordInputRef.current?.focus();
      } else if (e.key === "b") {
        router.push("/");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center text-black h-screen overflow-hidden">
      <div className="w-full max-w-3xl mx-auto px-6">
        <Button
          variant="outline"
          className="mb-10 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <ChevronsLeft size={16} />
          Back [b]
        </Button>
      </div>
      <div className="w-full max-w-3xl mx-auto px-6">
        <h1 className="text-3xl">
          {greeting}
        </h1>
        <form className="mt-1" onSubmit={handleSubmit}>
          <div className="relative mt-5">
            <Input
              ref={wordInputRef}
              type="text"
              name="word"
              placeholder="Enter new word"
              value={word}
              onChange={(e) => {
                setWord(e.target.value);
              }}
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none bg-gray-100 text-gray-500 text-xs px-1.5 py-0.5 rounded border">
              ⌘K
            </kbd>
          </div>
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
          <Button type="submit" className="mt-5 w-full cursor-pointer">
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
            isOwner={isOwner(getWord?.owner || "")}
          />
        </div>
      )}
      <Toaster position="bottom-right" />
    </main>
  );
}
