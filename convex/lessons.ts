import { v } from "convex/values";

import { query } from "./_generated/server";

export const getByAnalysis = query({
  args: {
    analysisId: v.id("analyses"),
  },
  handler: async (ctx, args) => {
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_analysisId", (q) => q.eq("analysisId", args.analysisId))
      .collect();

    return lessons.map((lesson) => ({
      id: lesson._id,
      postId: lesson.postId,
      analysisId: lesson.analysisId,
      type: lesson.type,
      content: lesson.content,
      createdAt: lesson.createdAt,
    }));
  },
});
