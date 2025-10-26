import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { rateLimit } from "@/utility/RatelimitSetup";

export async function POST(request: Request) {
  try {
    const { word } = await request.json();

    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("cf-connecting-ip") ||
      "unknown";

    const { success, reset } = await rateLimit.limit(ip);

    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again later.",
          reset,
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const { text } = await generateText({
      model: google("gemini-2.5-flash-lite-preview-06-17"),
      prompt: `Provide a concise, little short (but not too short), accurate, to the point and very simple and easy to understand definition without any markdown syntax for the word: "${word}".`,
    })

    return new Response(JSON.stringify({ definition: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response('Bad Request', { status: 400 });
  }
}
