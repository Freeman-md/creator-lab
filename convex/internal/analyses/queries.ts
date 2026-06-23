import { v } from "convex/values";
import { internalQuery } from "../../server";
import { getAnalysisOrThrow } from "../../lib/reads";

export const getInternal = internalQuery({
  args: {
    analysisId: v.id("analyses"),
  },
  handler: async (ctx, args) => {
    const analysis = await getAnalysisOrThrow(ctx, args.analysisId)

    return analysis
  },
});