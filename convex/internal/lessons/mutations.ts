import { v } from "convex/values";

import { lesson } from "../../schemas/lessons";
import { getLessons } from "../../lib/reads";
import { internalMutation } from "../triggers";

export const replace = internalMutation({
  args: {
    postId: v.id("posts"),
    analysisId: v.id("analyses"),
    lessons: v.array(v.object(lesson)),
  },
  handler: async (ctx, args) => {
    const existingLessons = await getLessons(ctx, args.analysisId);

    for (const lesson of existingLessons) {
      await ctx.db.delete(lesson._id);
    }

    for (const lesson of args.lessons) {
      await ctx.db.insert("lessons", {
        postId: args.postId,
        analysisId: args.analysisId,
        type: lesson.type,
        content: lesson.content,
      });
    }
  },
});
