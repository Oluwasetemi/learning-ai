import { Heading } from "@/components/heading";
import { Code, Text } from "@/components/text";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {/*check the stream, text - versions of the generateText or generateObject  */}
        <Heading>AI Explorer</Heading>
        <Text>Showing cool feature of <Code>useChat</Code> <Code>generateText</Code>, <Code>generateObject</Code> from the ai-sdk. It contains both the frontend and backend implementation using Anthropic and openai models</Text>
      </main>
    </div>
  );
}
