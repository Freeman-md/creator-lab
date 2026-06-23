import { v } from "convex/values";

import { internal } from "./_generated/api";
import { authMutation, authQuery, mutation } from "./server";
import { ANALYSIS_STATUS, BRIEF_STATUS } from "./lib/constants";
import { toBriefRecord, toBriefSnapshot } from "./lib/mappers";
import { getOwnedBriefOrThrow, getOwnedAnalysisOrThrow } from "./lib/ownership";
import { getBrief, getBriefOrThrow, getLessons, getPatterns } from "./lib/reads";


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
  handler: async (ctx, args) => {
    const { analysis, post } = await getOwnedAnalysisOrThrow(
      ctx,
      args.analysisId
    );

    if (analysis.status !== ANALYSIS_STATUS.COMPLETED) {
      throw new Error("Brief generation requires a completed analysis.");
    }

    const existingBrief = await getBrief(ctx, analysis._id);

    if (
      existingBrief &&
      (existingBrief.status === BRIEF_STATUS.COMPLETED ||
        existingBrief.status === BRIEF_STATUS.IN_PROGRESS)
    ) {
      return toBriefRecord(existingBrief);
    }

    const lessons = await getLessons(ctx, analysis._id);
    const patterns = await getPatterns(ctx, analysis._id);

    if (lessons.length === 0 && patterns.length === 0) {
      throw new Error("Brief generation requires lessons or patterns from the completed analysis.");
    }

    const now = Date.now();
    const snapshot = toBriefSnapshot(post, analysis, lessons, patterns);

    const briefPayload = {
      postId: analysis.postId,
      analysisId: args.analysisId,
      status: BRIEF_STATUS.IN_PROGRESS,
      snapshot,
      startedAt: now,
      updatedAt: now,
    };

    const briefId = existingBrief
      ? existingBrief._id
      : await ctx.db.insert("briefs", briefPayload);

    if (existingBrief) {
      await ctx.db.replace(existingBrief._id, briefPayload);
    }

    await ctx.scheduler.runAfter(
      0,
      internal.internal.briefs.actions.runBriefGeneration,
      { briefId }
    );

    const brief = await getBriefOrThrow(ctx, briefId);

    return toBriefRecord(brief);
  },
});