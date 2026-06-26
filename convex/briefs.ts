import { v } from "convex/values";

import { internal } from "./_generated/api";
import { authMutation, authQuery } from "./server";
import { toBriefRecord } from "./lib/mappers";
import { getOwnedBriefOrThrow, getOwnedAnalysisOrThrow } from "./lib/ownership";
import { getBrief } from "./lib/reads";


export const get = authQuery({
  args: {
    analysisId: v.id("analyses"),
    briefId: v.optional(v.id("briefs")),
  },
  handler: async (ctx, args) => {
    if (args.briefId) {
      const { brief } = await getOwnedBriefOrThrow(ctx, args.briefId);
      return toBriefRecord(brief);
    }

    await getOwnedAnalysisOrThrow(ctx, args.analysisId);
    const brief = await getBrief(ctx, args.analysisId);

    return brief ? toBriefRecord(brief) : null;
  },
});

export const create = authMutation({
  args: {
    analysisId: v.id("analyses"),
  },
  handler: async (ctx, args): Promise<ReturnType<typeof toBriefRecord>> => {
    await getOwnedAnalysisOrThrow(ctx, args.analysisId);

    return await ctx.runMutation(internal.internal.briefs.mutations.create, {
      analysisId: args.analysisId,
    });
  },
});
