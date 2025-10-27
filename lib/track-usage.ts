import type {LanguageModelUsage} from 'ai';

export async function apiWithUsageTracking<T>(
  operation: Promise<T>,
  metadata?: Record<string, unknown>
): Promise<Response> {
  try {
    const result = await operation;

    if (result && typeof result === 'object' && 'usage' in result) {
      const usageVal = (result as Record<string, unknown & { usage: LanguageModelUsage | Promise<LanguageModelUsage> }>).usage;

      if (usageVal instanceof Promise) {
        usageVal.then((usageData: LanguageModelUsage) => {
          console.log(
            `[Token Usage] Input: ${usageData.inputTokens}, ` +
            `Output: ${usageData.outputTokens}, ` +
            `Total: ${usageData.totalTokens}`,
            metadata ? `| Metadata: ${JSON.stringify(metadata)}` : ''
          );
        });
      } else if (usageVal && typeof usageVal === 'object' && 'inputTokens' in usageVal && 'outputTokens' in usageVal && 'totalTokens' in usageVal) {
        console.log(
          `[Token Usage] Input: ${usageVal.inputTokens}, ` +
          `Output: ${usageVal.outputTokens}, ` +
          `Total: ${usageVal.totalTokens}`,
          metadata ? `| Metadata: ${JSON.stringify(metadata)}` : ''
        );
      }
    }

    if (result && typeof result === 'object' && 'text' in result) {
      return Response.json({ result: result.text });
    }

    return Response.json({ result });
  } catch (error) {
    console.error('Error in apiWithUsageTracking:', error);
    return Response.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}

// Special handler for stream results that need to be converted to responses
export async function apiWithUsageTrackingStream<T>(
  operation: Promise<T>,
  metadata?: Record<string, unknown>
): Promise<Response> {
  const result = await operation;

  if (result && typeof result === 'object' && 'usage' in result) {
    const usageVal = (result as Record<string, unknown & { usage: LanguageModelUsage | Promise<LanguageModelUsage> }>).usage;

    if (usageVal instanceof Promise) {
      usageVal.then((usageData: LanguageModelUsage) => {
        console.log(
          `[Token Usage] Input: ${usageData.inputTokens}, ` +
          `Output: ${usageData.outputTokens}, ` +
          `Total: ${usageData.totalTokens}`,
          metadata ? `| Metadata: ${JSON.stringify(metadata)}` : ''
        );
      });
    } else if (usageVal && typeof usageVal === 'object' && 'inputTokens' in usageVal && 'outputTokens' in usageVal && 'totalTokens' in usageVal) {
      console.log(
        `[Token Usage] Input: ${usageVal.inputTokens}, ` +
        `Output: ${usageVal.outputTokens}, ` +
        `Total: ${usageVal.totalTokens}`,
        metadata ? `| Metadata: ${JSON.stringify(metadata)}` : ''
      );
    }
  }

  if (result && typeof result === 'object' && 'toUIMessageStreamResponse' in result) {
    return (result as { toUIMessageStreamResponse: () => Response }).toUIMessageStreamResponse();
  }

  return result as unknown as Response;
}
