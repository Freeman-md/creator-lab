import { v } from "convex/values";

import { authQuery, internalMutation } from "./server";
import { toPatternRecord } from "./lib/mappers";
import { getOwnedAnalysisOrThrow } from "./lib/ownership";
import { getPatterns } from "./lib/reads";

export const getByAnalysis = authQuery({
  args: {
    analysisId: v.id("analyses"),
  },
  handler: async (ctx, args) => {
    await getOwnedAnalysisOrThrow(ctx, args.analysisId);

    const patterns = await getPatterns(ctx, args.analysisId);

    return patterns.map((pattern) => toPatternRecord(pattern));
  },
});

export const replaceForAnalysis = internalMutation({
  args: {
    postId: v.id("posts"),
    analysisId: v.id("analyses"),
    patterns: v.array(
      v.object({
        sentiment: v.union(v.literal("positive"), v.literal("negative")),
        score: v.number(),
        name: v.string(),
        description: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existingPatterns = await getPatterns(ctx, args.analysisId);

    for (const pattern of existingPatterns) {
      await ctx.db.delete(pattern._id);
    }

    for (const pattern of args.patterns) {
      await ctx.db.insert("patterns", {
        postId: args.postId,
        analysisId: args.analysisId,
        sentiment: pattern.sentiment,
        score: pattern.score,
        name: pattern.name,
        description: pattern.description,
      });
    }
  },
});
