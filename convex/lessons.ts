import { v } from "convex/values";

import { getLessons } from "./lib/reads";
import { toLessonRecord } from "./lib/mappers";
import { authQuery, internalMutation } from "./server";
import { lesson } from "./schemas/lessons";
import { getOwnedAnalysisOrThrow } from "./lib/ownership";

export const getByAnalysis = authQuery({
  args: {
    analysisId: v.id("analyses"),
  },
  handler: async (ctx, args) => {
    await getOwnedAnalysisOrThrow(ctx, args.analysisId);

    const lessons = await getLessons(ctx, args.analysisId);

    return lessons.map((lesson) => toLessonRecord(lesson));
  },
});

export const replaceForAnalysis = internalMutation({
  args: {
    postId: v.id("posts"),
    analysisId: v.id("analyses"),
    lessons: v.array(
      v.object(lesson)
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
