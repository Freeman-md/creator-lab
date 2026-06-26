import { v } from "convex/values";

import { pattern } from "../../schemas/patterns";
import { getPatterns } from "../../lib/reads";
import { internalMutation } from "../triggers";

export const replace = internalMutation({
  args: {
    postId: v.id("posts"),
    analysisId: v.id("analyses"),
    patterns: v.array(v.object(pattern)),
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
