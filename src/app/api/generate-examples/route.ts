import { google } from "@ai-sdk/google";
import { generateText } from "ai";
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
      prompt: `Use the given word to write 2 example sentences to showcase how can this word be used in real-life. Make sure you use simple and easy to understand sentences that is not too long or complex

      Your response should be in JSON format with a key "examples" containing an array of 2 sentences.
      Word:"${word}".`,
    })

    const cleaned = text.replace(/^```json\s*/, '').replace(/```$/, '');
    const parsed = JSON.parse(cleaned);

    return new Response(JSON.stringify({ examples: parsed.examples }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response('Bad Request', { status: 400 });
  }
}
