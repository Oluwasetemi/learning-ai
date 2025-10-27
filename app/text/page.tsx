'use client';
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Streamdown } from "streamdown";
import React, { useState } from "react";

function TextPage() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [prompt, setPrompt] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null); // Clear previous result
    const formData = new FormData(e.target as HTMLFormElement);
    const prompt = formData.get("prompt") as string;

    try {
      const response = await fetch('/api/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate text');
      }

      const data = await response.json();
      setResult(data.result);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error('An unknown error occurred');
      }
      setResult(null);
      setError("Error generating text");
    } finally {
      setLoading(false);
      // Clear the form input
      (e.target as HTMLFormElement).reset();
    }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-background rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Text Generator
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a prompt and let AI generate text for you
            </p>
          </div>

          {/* Result Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Generated Text
            </label>
            <div className="min-h-[200px] bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              {loading ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400 dark:border-gray-500"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-32"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-4/5"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              ) : result ? (
                <div className="text-gray-900 dark:text-gray-100">
                  <Streamdown isAnimating={loading}>
                    {result}
                  </Streamdown>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  Your generated text will appear here...
                </p>
              )}
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter your prompt
              </label>
              <Input
                id="prompt"
                type="text"
                placeholder="What would you like me to generate?"
                name="prompt"
                autoFocus
                // value={prompt || ''}
                // onChange={(e) => setPrompt(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button disabled={loading} type="submit" className="cursor-pointer disabled:cursor-not-allowed w-full">
              {loading ? 'Generating...' : 'Generate Text'}
            </Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default TextPage;
