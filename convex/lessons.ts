import { v } from "convex/values";

import { getLessons } from "./lib/reads";
import { toLessonRecord } from "./lib/mappers";
import { authQuery } from "./server";
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
