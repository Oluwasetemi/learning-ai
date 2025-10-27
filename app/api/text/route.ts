import { apiWithUsageTracking } from "@/lib/track-usage";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

async function handler(request: Request) {
  try {
    // Log the custom header from middleware: Testing the proxy middleware
    const customHeader = request.headers.get('x-request-sample');
    console.log(`[Text API] Custom header x-request-sample: ${customHeader}`);

    const body = await request.json().catch(() => {
      throw new Error("Invalid JSON in request body");
    });

    if (!body || !body.prompt) {
      throw new Error("Prompt is required");
    }

    const { prompt } = body;

    const result = await generateText({
      system: "You are a helpful assistant that generates text based on a prompt.",
      model: openai("gpt-4o-mini"),
      prompt: prompt || "How many r's exist in the word strawberries?"
    });

    if (!result.text) {
      throw new Error("Failed to generate text");
    }

    return result;
  } catch (error) {
    console.error("Error in POST /api/text:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  return apiWithUsageTracking(handler(request));
}
