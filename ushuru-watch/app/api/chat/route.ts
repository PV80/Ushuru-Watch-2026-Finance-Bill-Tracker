import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToCoreMessages } from "ai";
import { CHAT_SYSTEM } from "@/lib/prompts";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-5"),
    system: CHAT_SYSTEM,
    messages: convertToCoreMessages(messages),
    temperature: 0.3,
  });

  return result.toDataStreamResponse();
}
