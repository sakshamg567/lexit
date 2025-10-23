"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import WordCard from "@/components/WordCard";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const words = useQuery(api.words.getWords) || [];
  const wordsCount = useQuery(api.words.getTotalWordCount) || 0;

  const [query, setQuery] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const filteredWords = words.filter((word) =>
    word.word.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const wordList = document.querySelector("[data-word-list]");

      if (event.key === "k") {
        if (event.metaKey || event.ctrlKey) {
          event.preventDefault();
          searchInputRef.current?.focus();
        } else {
          event.preventDefault();
          // Scroll up through word list
          if (wordList) {
            wordList.scrollBy({ top: -100, behavior: "smooth" });
          }
        }
        return;
      }

      switch (event.key) {
        case "/":
          event.preventDefault();
          searchInputRef.current?.focus();
          break;
        case "Escape":
          if (showHelp) {
            setShowHelp(false);
          } else {
            setQuery("");
          }
          break;
        case "Enter":
          if (searchInputRef.current === document.activeElement) {
            event.preventDefault();
            // Search is already handled by the form
          }
          break;
        case "+":
        case "a":
        case "A":
          event.preventDefault();
          router.push("/add-word");
          break;
        case "j":
        case "J":
          event.preventDefault();
          // Scroll down through word list
          if (wordList) {
            wordList.scrollBy({ top: 100, behavior: "smooth" });
          }
          break;
        case "?":
          if (event.shiftKey) {
            event.preventDefault();
            setShowHelp(!showHelp);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router, showHelp]);

  return (
    <main className="flex flex-col items-center justify-center text-black h-screen overflow-hidden">
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
      <div
        className="w-full max-w-3xl mx-auto max-h-[65vh] overflow-y-auto"
        data-word-list
      >
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

      {/* Help Dialog */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                onKeyDown={(e) => e.key === "Enter" && setShowHelp(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close help dialog"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span>Focus search</span>
                <div className="flex gap-1">
                  <kbd className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border">
                    ⌘K
                  </kbd>
                  <kbd className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border">
                    /
                  </kbd>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Clear search</span>
                <kbd className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border">
                  Esc
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Add new word</span>
                <div className="flex gap-1">
                  <kbd className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border">
                    +
                  </kbd>
                  <kbd className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border">
                    A
                  </kbd>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Scroll through words</span>
                <div className="flex gap-1">
                  <kbd className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border">
                    J
                  </kbd>
                  <kbd className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border">
                    K
                  </kbd>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Show this help</span>
                <kbd className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border">
                  Shift + ?
                </kbd>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t text-xs text-gray-500 text-center">
              Press{" "}
              <kbd className="bg-gray-100 text-gray-600 text-xs px-1 py-0.5 rounded border">
                Esc
              </kbd>{" "}
              or click outside to close
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
