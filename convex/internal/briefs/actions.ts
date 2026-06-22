"use node";

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { v } from "convex/values";

import { internalAction } from "../../_generated/server";
import { api, internal } from "../../_generated/api";
import { formatBriefInput } from "../../ai/formatBriefInput";
import { buildBriefInstructions } from "../../ai/briefPrompt";
import { briefOutputSchema } from "../../ai/schemas";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured for Convex brief jobs.");
  }

  return new OpenAI({ apiKey });
}

export const runBriefGeneration = internalAction({
  args: {
    briefId: v.id("briefs"),
  },
  handler: async (ctx, args) => {
    try {
      const detail = await ctx.runQuery(internal.briefs.getInternal, {
        briefId: args.briefId,
      });
      const brief = detail.brief;
      if (!brief) {
        throw new Error("Brief not found.");
      }

      const client = getClient();
      const model = process.env.OPENAI_BRIEF_MODEL ?? "gpt-4.1-mini";
      const inputMarkdown = formatBriefInput(
        brief.input as Parameters<typeof formatBriefInput>[0]
      );
      const completion = await client.chat.completions.parse({
        model,
        messages: [
          {
            role: "developer",
            content: buildBriefInstructions(),
          },
          {
            role: "user",
            content: inputMarkdown,
          },
        ],
        response_format: zodResponseFormat(
          briefOutputSchema,
          "creator_lab_brief_output"
        ),
      });

      const parsed = completion.choices[0]?.message.parsed;
      if (!parsed) {
        throw new Error("OpenAI returned no structured brief output.");
      }

      await ctx.runMutation(api.briefs.complete, {
        briefId: args.briefId,
        output: parsed,
      });
    } catch (error) {
      await ctx.runMutation(api.briefs.fail, {
        briefId: args.briefId,
        errorMessage:
          error instanceof Error ? error.message : "Brief generation failed.",
      });
    }
  },
});
