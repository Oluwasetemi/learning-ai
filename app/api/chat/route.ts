import { apiWithUsageTrackingStream } from "@/lib/track-usage";
import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, UIMessage } from "ai";


async function handler(request: Request) {
  try {
    const {messages}: { messages: UIMessage[] } = await request.json().catch(() => {
      throw new Error("Invalid JSON in request body");
    });

    if (!messages || messages.length === 0) {
      throw new Error("Messages are required");
    }

    const result = await streamText({
      model: anthropic("claude-sonnet-4-5"),
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates text based on a prompt. short and concise answers are preferred.",
        },
        ...convertToModelMessages(messages),
      ],
    });

    return result;
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  return apiWithUsageTrackingStream(handler(request));
}
