import "server-only";
import { openai } from "./openai-client";
import { GLOBAL_SYSTEM_PROMPT } from "./system-prompt";

export async function generateWithOpenAI(input: string): Promise<string> {
  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1",
    instructions: GLOBAL_SYSTEM_PROMPT,
    input,
  });

  return response.output_text;
}
