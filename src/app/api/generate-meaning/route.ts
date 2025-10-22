import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: Request) {
  try {
    const { word } = await request.json();
    const { text } = await generateText({
      model: google("gemini-2.5-flash-lite-preview-06-17"),
      prompt: `Provide a concise, short, accurate, to the point and easy to understand definition without any markdown syntax for the word: "${word}".`,
    })

    return new Response(JSON.stringify({ definition: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response('Bad Request', { status: 400 });
  }
}
