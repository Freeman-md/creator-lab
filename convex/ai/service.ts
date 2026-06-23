import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import z from "zod";

type MessageRole = "developer" | "system" | "user";

type GenerateStructuredOutputArgs<TSchema extends z.ZodType> = {
  model?: string;
  instructions: string;
  userInput: string;
  schema: TSchema;
  schemaName: string;
  missingOutputMessage: string;
};

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured for Convex analysis jobs.");
  }

  return new OpenAI({ apiKey });
}

export async function generateStructuredOutput<TSchema extends z.ZodType>({
  model = "gpt-5.4-mini",
  instructions,
  userInput,
  schema,
  schemaName,
  missingOutputMessage,
}: GenerateStructuredOutputArgs<TSchema>): Promise<z.infer<TSchema>> {
  const client = getOpenAIClient();

  const completion = await client.chat.completions.parse({
    model: model,
    messages: [
      {
        role: "developer" as MessageRole,
        content: instructions,
      },
      {
        role: "user" as MessageRole,
        content: userInput,
      },
    ],
    response_format: zodResponseFormat(schema, schemaName),
  });

  const parsed = completion.choices[0]?.message.parsed;

  if (!parsed) {
    throw new Error(missingOutputMessage);
  }

  return parsed;
}