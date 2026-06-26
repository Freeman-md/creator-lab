import { v } from "convex/values";

import { authQuery } from "./server";
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
