import { apiWithUsageTrackingStream } from "@/lib/track-usage";
import { anthropic } from "@ai-sdk/anthropic";
// import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

async function handler(request: Request) {
  try {
    const customHeader = request.headers.get('x-request-sample');
    console.log(`[Stream API] Custom header x-request-sample: ${customHeader}`);

    const body = await request.json().catch(() => {
      throw new Error("Invalid JSON in request body");
    });

    if (!body || !body.prompt) {
      throw new Error("Prompt is required");
    }

    const { prompt } = body;

    const result = await streamText({
      // model: openai("gpt-4"),
      model: anthropic("claude-sonnet-4-5"),
      prompt,
      system: "You are a helpful assistant that generates text based on a prompt.",
    });

    return result;
  } catch (error) {
    console.error("Error in POST /api/stream:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  return apiWithUsageTrackingStream(handler(request));
}
