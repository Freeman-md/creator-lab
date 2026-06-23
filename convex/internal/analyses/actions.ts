"use node";

import { v } from "convex/values";

import { internalAction } from "../../_generated/server";
import { internal } from "../../_generated/api";
import { formatAnalysisSnapshot } from "../../ai/formatters/format-analysis-snapshot";
import { analysisOutputSchema } from "../../ai/schemas";
import { generateStructuredOutput } from "../../ai/service";
import { buildAnalysisInstructions } from "../../ai/system-prompts";

export const runAnalysis = internalAction({
  args: {
    analysisId: v.id("analyses"),
  },
  handler: async (ctx, args) => {
    try {
      const analysis = await ctx.runQuery(internal.internal.analyses.queries.getInternal, {
        analysisId: args.analysisId,
      });

      const parsed = await generateStructuredOutput({
        instructions: buildAnalysisInstructions(),
        userInput: formatAnalysisSnapshot(analysis.snapshot),
        schema: analysisOutputSchema,
        schemaName: "creator_lab_analysis_output",
        missingOutputMessage: "OpenAI returned no structured analysis output.",
      });

      await ctx.runMutation(internal.internal.analyses.mutations.complete, {
        analysisId: args.analysisId,
        output: parsed,
      });
    } catch (error) {
      await ctx.runMutation(internal.internal.analyses.mutations.fail, {
        analysisId: args.analysisId,
        errorMessage:
          error instanceof Error ? error.message : "Analysis generation failed.",
      });
    }
  },
});
