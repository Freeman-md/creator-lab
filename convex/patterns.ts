import { v } from "convex/values";

import { query } from "./_generated/server";

export const getByAnalysis = query({
  args: {
    analysisId: v.id("analyses"),
  },
  handler: async (ctx, args) => {
    const patterns = await ctx.db
      .query("patterns")
      .withIndex("by_analysisId", (q) => q.eq("analysisId", args.analysisId))
      .collect();

    return patterns.map((pattern) => ({
      id: pattern._id,
      postId: pattern.postId,
      analysisId: pattern.analysisId,
      sentiment: pattern.sentiment,
      score: pattern.score,
      name: pattern.name,
      description: pattern.description,
      createdAt: pattern.createdAt,
    }));
  },
});
