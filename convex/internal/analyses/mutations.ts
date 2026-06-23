import { v } from "convex/values";
import { internalMutation } from "../triggers";
import { ANALYSIS_STATUS } from "../../lib/constants";
import { lesson } from "../../schemas/lessons";
import { pattern } from "../../schemas/patterns";
import { getAnalysisOrThrow } from "../../lib/reads";
import { api, internal } from "../../_generated/api";
import { toAnalysisRecord } from "../../lib/mappers";

export const complete = internalMutation({
  args: {
    analysisId: v.id("analyses"),
    output: v.object({
      summary: v.object({
        content: v.string(),
        reasoning: v.string(),
        confidence: v.union(
          v.literal("low"),
          v.literal("medium"),
          v.literal("high")
        ),
      }),
      lessons: v.array(
        v.object(lesson)
      ),
      patterns: v.array(
        v.object(pattern)
      ),
    }),
  },
  handler: async (ctx, args) => {
    const analysis = await getAnalysisOrThrow(ctx, args.analysisId)

    if (analysis.status !== ANALYSIS_STATUS.IN_PROGRESS) {
      throw new Error("Only in-progress analyses can be completed.");
    }

    const now = Date.now();
    await ctx.db.patch(analysis._id, {
      status: ANALYSIS_STATUS.COMPLETED,
      isStale: false,
      content: args.output.summary.content,
      reasoning: args.output.summary.reasoning,
      confidence: args.output.summary.confidence,
      completedAt: now,
      updatedAt: now,
    });

    await Promise.all([
      await ctx.runMutation(internal.lessons.replaceForAnalysis, {
        postId: analysis.postId,
        analysisId: analysis._id,
        lessons: args.output.lessons,
      }),

      await ctx.runMutation(internal.patterns.replaceForAnalysis, {
        postId: analysis.postId,
        analysisId: analysis._id,
        patterns: args.output.patterns,
      })
    ])

    await ctx.runMutation(api.briefs.create, {
      analysisId: analysis._id,
    });

    const completedAnalysis = await getAnalysisOrThrow(ctx, analysis._id)

    return toAnalysisRecord(completedAnalysis);
  },
});

export const fail = internalMutation({
  args: {
    analysisId: v.id("analyses"),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const analysis = await getAnalysisOrThrow(ctx, args.analysisId)

    if (analysis.status !== ANALYSIS_STATUS.IN_PROGRESS) {
      throw new Error("Only an in-progress analysis can be marked as failed.");
    }

    const now = Date.now();
    await ctx.db.patch(args.analysisId, {
      status: ANALYSIS_STATUS.FAILED,
      isStale: false,
      errorMessage: args.errorMessage,
      completedAt: now,
      updatedAt: now,
    });

    const failedAnalysis = await getAnalysisOrThrow(
      ctx, 
      analysis._id,
      "Analysis failure state was not saved."
    )

    return toAnalysisRecord(failedAnalysis);
  },
});
