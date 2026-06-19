"use node";

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { v } from "convex/values";

import { internalAction } from "../_generated/server";
import { api } from "../_generated/api";
import { formatAnalysisSnapshot } from "../ai/formatAnalysisSnapshot";
import { buildAnalysisInstructions } from "../ai/analysisPrompt";
import { analysisOutputSchema } from "../ai/schemas";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured for Convex analysis jobs.");
  }

  return new OpenAI({ apiKey });
}

export const runAnalysis = internalAction({
  args: {
    analysisId: v.id("analyses"),
  },
  handler: async (ctx, args) => {
    try {
      const detail = await ctx.runQuery(api.analyses.get, {
        analysisId: args.analysisId,
      });

      const client = getClient();
      const model = process.env.OPENAI_ANALYSIS_MODEL ?? "gpt-4.1-mini";
      const snapshotMarkdown = formatAnalysisSnapshot(
        detail.analysis.snapshot as Parameters<typeof formatAnalysisSnapshot>[0]
      );
      const completion = await client.chat.completions.parse({
        model,
        messages: [
          {
            role: "developer",
            content: buildAnalysisInstructions(),
          },
          {
            role: "user",
            content: snapshotMarkdown,
          },
        ],
        response_format: zodResponseFormat(
          analysisOutputSchema,
          "creator_lab_analysis_output"
        ),
      });

      const parsed = completion.choices[0]?.message.parsed;
      if (!parsed) {
        throw new Error("OpenAI returned no structured analysis output.");
      }

      await ctx.runMutation(api.analyses.complete, {
        analysisId: args.analysisId,
        output: parsed,
      });
    } catch (error) {
      await ctx.runMutation(api.analyses.fail, {
        analysisId: args.analysisId,
        errorMessage:
          error instanceof Error ? error.message : "Analysis generation failed.",
      });
    }
  },
});
