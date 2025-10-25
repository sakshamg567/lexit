"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Check, ChevronsLeft, RotateCw } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import WordCard from "@/components/WordCard";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

const notifySuccess = () => toast.success("Word added successfully!");

// Dummy generator functions
const generateDummyMeaning = (word: string) =>
  `Meaning of ${word} (${Math.floor(Math.random() * 100)})`;
const generateDummyExample = (word: string) =>
  `${word} used in a sentence example #${Math.floor(Math.random() * 100)}`;

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

  const [meaningCooldown, setMeaningCooldown] = useState(false);
  const [examplesCooldown, setExamplesCooldown] = useState<boolean[]>([]);

  const greetings = [
    "Discovered a new word? Let's define it!",
    "Found a word no one knows? Add it here!",
    "Help us grow the dictionary! Submit your word.",
    "Got a rare word? Share its meaning!",
    "What did you come across?",
  ];
  const [greeting, setGreeting] = useState("");

  // Random greeting on load
  useEffect(() => {
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);

  // Auto-generate dummy meaning & examples when the word changes
  useEffect(() => {
    if (!word.trim()) {
      setMeaning("");
      setExamples([]);
      return;
    }
    setMeaning(generateDummyMeaning(word));
    setExamples([generateDummyExample(word), generateDummyExample(word)]);
  }, [word]);

  // Initialize example cooldowns
  useEffect(() => {
    setExamplesCooldown(examples.map(() => false));
  }, [examples]);

  // Reload handlers
  const reloadMeaning = () => {
    if (meaningCooldown) return;
    setMeaning(generateDummyMeaning(word));
    setMeaningCooldown(true);
    setTimeout(() => setMeaningCooldown(false), 5000);
  };

  const reloadExample = (index: number) => {
    if (examplesCooldown[index]) return;
    const newExamples = [...examples];
    newExamples[index] = generateDummyExample(word);
    setExamples(newExamples);

    setExamplesCooldown(prev => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
    setTimeout(() => {
      setExamplesCooldown(prev => {
        const updated = [...prev];
        updated[index] = false;
        return updated;
      });
    }, 5000);
  };

  const existingWords = words.map((w) => w.word.toLowerCase());
  const alreadyExists = existingWords.includes(word.toLowerCase());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!word.trim()) return;
    if (word.includes(" ")) return;
    if (alreadyExists) return;

    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);

    void createWord({
      owner: user?.id || "anonymous",
      word: capitalizedWord,
      meaning,
      examples,
    });
    void updateCount();
    notifySuccess();

    setWord("");
    setMeaning("");
    setExamples([]);
  };

  const isOwner = (ownerId: string) => ownerId === user?.id;

  const [isReload, setIsReload] = useState(false)

  // Reload handler helper
const handleReload = async (
  type: "meaning" | "example",
  index?: number
) => {
  if (type === "meaning") {
    if (meaningCooldown) return;
    setMeaningCooldown(true);
    await new Promise((res) => setTimeout(res, 1000));
    setMeaning(generateDummyMeaning(word));
    setMeaningCooldown(false);
  } else if (type === "example" && index !== undefined) {
    if (examplesCooldown[index]) return;
    setExamplesCooldown((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });

    await new Promise((res) => setTimeout(res, 1000));
    const newExamples = [...examples];
    newExamples[index] = generateDummyExample(word);
    setExamples(newExamples);

    setExamplesCooldown((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  }
};


  return (
    <main className="flex flex-col items-center justify-center text-black h-screen overflow-hidden">
      <div className="w-full max-w-3xl mx-auto px-6">
        <Button
          variant="outline"
          className="mb-10 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <ChevronsLeft size={16} /> Back [b]
        </Button>

        <h1 className="text-3xl">{greeting}</h1>

        <form className="mt-5" onSubmit={handleSubmit}>
          <div className="relative">
            <Input
              ref={wordInputRef}
              type="text"
              name="word"
              placeholder="Enter new word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
          </div>

          {/* Meaning Section */}
        {/* Meaning Section */}
{meaning && (
  <section className="relative mt-5">
    <label className="block font-medium text-sm text-gray-700">
      Definition (AI placeholder)
    </label>
    <div className="flex items-center border-dashed border-2 rounded-md px-3 py-2 bg-white text-sm">
      <span className="flex-1">{meaning}</span>
      <button
        type="button"
        onClick={() => handleReload("meaning")}
            className="ml-2 p-1 rounded-md text-neutral-500 bg-neutral-100 hover:bg-neutral-200/50 flex justify-center items-center cursor-pointer"
      >
        {meaningCooldown ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <RotateCw size={15} className="animate-spin text-black transition-all duration-250 ease-out" />
          </motion.div>
        ) : (
          <RotateCw size={15} />
        )}
      </button>
    </div>
  </section>
)}



          {/* Examples Section */}
          {/* Examples Section */}
{examples.length > 0 && (
  <section className="mt-5">
    <label className="block font-medium text-sm text-gray-700">
      Example Sentences (AI placeholders)
    </label>
    <div className="mt-2 space-y-2">
      {examples.map((example, index) => (
        <div
          key={index}
          className="flex items-center border-dashed border-2 rounded-md px-3 py-2 bg-white text-sm"
        >
          <span className="flex-1">{example}</span>
          <button
            type="button"
            onClick={() => handleReload("example", index)} // use handleReload helper
            className="ml-2 p-1 text-neutral-500 rounded-md bg-neutral-100 hover:bg-neutral-200/50 flex justify-center items-center cursor-pointer"
          >
            {examplesCooldown[index] ? (
              <motion.div
                style={{ display: "flex" }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
              >
            <RotateCw size={15} className="animate-spin text-black transition-all duration-250 ease-out" />
              </motion.div>
            ) : (
              <RotateCw size={15} />
            )}
          </button>
        </div>
      ))}
    </div>
  </section>
)}




          <Button type="submit" className="mt-5 w-full cursor-pointer">
            Add Word
          </Button>
        </form>

        {/* Already exists section */}
        {alreadyExists && (
          <div className="flex flex-col mt-5 justify-center items-center">
            <WordCard
              word={word}
              meaning={meaning}
              examples={examples}
              isOwner={isOwner(user?.id || "")}
            />
          </div>
        )}
      </div>

      <Toaster position="bottom-right" />
    </main>
  );
}
