'use client';
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useChat, useCompletion } from "@ai-sdk/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Streamdown } from "streamdown";
import React from "react";

function StreamClient() {
  const { completion, input, handleInputChange, handleSubmit, isLoading, error, stop } = useCompletion({
    api: '/api/stream',
  });
  return (
    <div className="min-h-screen bg-white dark:bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-background rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Stream Generator
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a prompt and watch AI generate text in real-time
            </p>
          </div>

          {/* Completion Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Generated Text
            </label>
            <div className="min-h-[200px] bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              {isLoading && (
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
              )}
              {completion ? (
                <div className="text-gray-900 dark:text-gray-100">
                  <Streamdown isAnimating={isLoading}>
                    {completion}
                  </Streamdown>
                </div>
              ) : (
                <p className="animate-pulse text-gray-500 dark:text-gray-400 italic">
                  Your generated text will appear here...
                </p>
              )}
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
            // (e.target as HTMLFormElement).reset()
            handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
          }} className="space-y-4">
            <div>
              <label htmlFor="input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter your prompt
              </label>
              <Input
                id="input"
                type="text"
                autoFocus
                placeholder="What would you like me to generate?"
                value={input}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
            <Button
              disabled={isLoading || input.length === 0}
              type="submit"
              className="cursor-pointer disabled:cursor-not-allowed w-full"
            >
              {isLoading ? 'Streaming...' : 'Generate Text'}
            </Button>
            <Button
              disabled={!isLoading || input.length === 0}
              className="ml-2 cursor-pointer disabled:cursor-not-allowed bg-red-500! hover:bg-red-600 text-white"
              onClick={() => stop()}
            >
              Stop
            </Button>
            </div>
            {error && (
              <div className="text-red-500 text-sm">
                Error: {error.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default StreamClient;
