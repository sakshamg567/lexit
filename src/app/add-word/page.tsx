'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import toast, { Toaster } from "react-hot-toast";
import { redirect } from "next/navigation";
import { ChevronsLeft } from "lucide-react";

const notifySuccess = () => toast.success("Word added successfully!");
const notifyError = (message: string) => toast.error(`Error: ${message}`);

export default function AddWord() {
  const createWord = useMutation(api.words.createWord);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const word = formData.get("word") as string;
    const meaning = "Placeholder meaning";
    const examples = ["Placeholder example 1", "Placeholder example 2"];

    try {
      void createWord({ word, meaning, examples });
      notifySuccess();
    } catch (error) {
      notifyError((error as Error).message);
    }

    form.reset();
  }

  const handleBack = () => {
    redirect('/');
  }

  return (
    <main className="flex flex-col items-center justify-center text-black min-h-screen">
      <div className="mr-auto mx-6">
        <Button variant="outline" className="mb-10" onClick={handleBack}>
          <ChevronsLeft size={16} />
          Back
        </Button>
      </div>
      <div>
        <h1 className="text-3xl">What new word did you discover?</h1>
        {/* TODO: Did you mean? */}
        <form className="mt-4" onSubmit={handleSubmit}>
          <Input type="text" name="word" placeholder="Enter new word" className="mt-5" />
          <Button type="submit" className="mt-5 w-full">Add Word</Button>
        </form>
      </div>
      <Toaster position="bottom-right" />
    </main>
  )
}
