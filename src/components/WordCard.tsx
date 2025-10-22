interface WordCardProps {
  word: string;
  meaning: string;
  examples: string[];
}

export default function WordCard({ word, meaning, examples }: WordCardProps) {
  return (
    <div className="mx-10 py-2 px-5 mb-5 border border-zinc-300 rounded-sm">
      <h2 className="text-xl font-semibold">{word}</h2>
      <p className="italic mb-2">{meaning}</p>
      <ul className="list-disc list-inside">
        {examples.map((example, index) => (
          <li key={index} className="mb-1">{example}</li>
        ))}
      </ul>
    </div>
  )
} 
