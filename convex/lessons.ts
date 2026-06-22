import { v } from "convex/values";

import { getLessons, getOwnedAnalysis } from "./lib/helpers";
import { toLessonRecord } from "./lib/mappers";
import { authQuery, internalMutation } from "./server";

export const getByAnalysis = authQuery({
  args: {
    analysisId: v.id("analyses"),
  },
  handler: async (ctx, args) => {
    await getOwnedAnalysis(ctx, args.analysisId);

    const lessons = await getLessons(ctx, args.analysisId);

    return lessons.map((lesson) => toLessonRecord(lesson));
  },
});

export const replaceForAnalysis = internalMutation({
  args: {
    postId: v.id("posts"),
    analysisId: v.id("analyses"),
    lessons: v.array(
      v.object({
        type: v.union(
          v.literal("repeat"),
          v.literal("avoid"),
          v.literal("improve")
        ),
        content: v.string(),
      })
    ),
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
