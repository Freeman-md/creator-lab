import { v } from "convex/values";
import { BRIEF_STATUS } from "../../lib/constants";
import { toBriefRecord, toBriefSnapshot } from "../../lib/mappers";
import { getAnalysisOrThrow, getBrief, getBriefOrThrow, getLessons, getPatterns, getPostOrThrow } from "../../lib/reads";
import { internalMutation } from "../triggers";
import { internal } from "../../_generated/api";
import { ANALYSIS_STATUS } from "../../lib/constants";

export const create = internalMutation({
  args: {
    analysisId: v.id("analyses"),
  },
  handler: async (ctx, args) => {
    const analysis = await getAnalysisOrThrow(ctx, args.analysisId);
    const post = await getPostOrThrow(ctx, analysis.postId);

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

export const complete = internalMutation({
  args: {
    briefId: v.id("briefs"),
    output: v.object({
      repeat: v.array(v.string()),
      avoid: v.array(v.string()),
      improve: v.array(v.string()),
      nextPost: v.object({
        angle: v.string(),
        why: v.string(),
        reminder: v.string(),
      }),
    }),
  },
  handler: async (ctx, args) => {
    const brief = await getBriefOrThrow(ctx, args.briefId)

    if (brief.status !== BRIEF_STATUS.IN_PROGRESS) {
      throw new Error("Only in-progress briefs can be completed.");
    }

    const now = Date.now();
    await ctx.db.patch(args.briefId, {
      status: BRIEF_STATUS.COMPLETED,
      repeat: args.output.repeat,
      avoid: args.output.avoid,
      improve: args.output.improve,
      nextPostAngle: args.output.nextPost.angle,
      nextPostReason: args.output.nextPost.why,
      nextPostReminder: args.output.nextPost.reminder,
      completedAt: now,
      updatedAt: now,
    });

    const completedBrief = await getBriefOrThrow(ctx, brief._id, "Brief completion failed")

    return toBriefRecord(completedBrief);
  },
});

export const fail = internalMutation({
  args: {
    briefId: v.id("briefs"),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const brief = await getBriefOrThrow(ctx, args.briefId)

    const now = Date.now();
    await ctx.db.patch(args.briefId, {
      status: BRIEF_STATUS.FAILED,
      errorMessage: args.errorMessage,
      completedAt: now,
      updatedAt: now,
    });

    const failedBrief = await getBriefOrThrow(ctx, brief._id, "Brief failure state was not saved.")


    return toBriefRecord(failedBrief);
  },
});
