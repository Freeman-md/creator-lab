import { v } from "convex/values";

import { internal } from "./_generated/api";
import { authMutation, authQuery } from "./server";
import { toBriefRecord } from "./lib/mappers";
import { getOwnedBriefOrThrow, getOwnedAnalysisOrThrow } from "./lib/ownership";


export const get = authQuery({
  args: {
    briefId: v.id("briefs"),
  },
  handler: async (ctx, args) => {
    const { brief } = await getOwnedBriefOrThrow(ctx, args.briefId)

    return toBriefRecord(brief);
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
