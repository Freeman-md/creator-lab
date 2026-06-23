"use node";

import { v } from "convex/values";
import { internalAction } from "../../_generated/server";
import { internal } from "../../_generated/api";
import { formatBriefInput } from "../../ai/formatters/format-brief-snapshot";
import { generateStructuredOutput } from "../../ai/service";
import { buildBriefInstructions } from "../../ai/system-prompts";
import { briefOutputSchema } from "../../ai/schemas";

export const runBriefGeneration = internalAction({
  args: {
    briefId: v.id("briefs"),
  },
  handler: async (ctx, args) => {
    try {
      const brief = await ctx.runQuery(internal.internal.briefs.queries.getInternal, {
        briefId: args.briefId,
      });

      const parsed = await generateStructuredOutput({
        instructions: buildBriefInstructions(),
        userInput: formatBriefInput(brief.snapshot),
        schema: briefOutputSchema,
        schemaName: "creator_lab_analysis_output",
        missingOutputMessage: "OpenAI returned no structured analysis output.",
      });

      await ctx.runMutation(internal.internal.briefs.mutations.complete, {
        briefId: args.briefId,
        output: parsed,
      });

    } catch (error) {

      await ctx.runMutation(internal.internal.briefs.mutations.fail, {
        briefId: args.briefId,
        errorMessage:
          error instanceof Error ? error.message : "Brief generation failed.",
      });

    }
  },
});
