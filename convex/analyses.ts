import { v } from "convex/values";

import { internal } from "./_generated/api";
import { authMutation, authQuery } from "./server";
import { getAnalysisOrThrow, getBrief, getLessons, getMetrics, getPatterns } from "./lib/reads";
import { toAnalysisRecord, toAnalysisSnapshotMetrics, toAnalysisSnapshotPost, toBriefRecord, toLessonRecord, toPatternRecord, toPostRecord } from "./lib/mappers";
import { getOwnedPostOrThrow, getOwnedAnalysisOrThrow } from "./lib/ownership";
import { ensureNoActiveAnalysis } from "./lib/guards";
import { ANALYSIS_STATUS } from "./lib/constants";

export const getAll = authQuery({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    await getOwnedPostOrThrow(ctx, args.postId);

    const analyses = await ctx.db
      .query("analyses")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();

    return Promise.all(
      analyses.map(async (analysis) => {
        const brief = await getBrief(ctx, analysis._id);

        return toAnalysisRecord(analysis, brief);
      })
    );
  },
});

export const get = authQuery({
  args: {
    analysisId: v.id("analyses"),
  },
  handler: async (ctx, args) => {
    const { analysis, post } = await getOwnedAnalysisOrThrow(ctx, args.analysisId);

    const [lessons, patterns, brief] = await Promise.all([
      await getLessons(ctx, analysis._id),
      await getPatterns(ctx, analysis._id),
      await getBrief(ctx, analysis._id)
    ])

    return {
      post: toPostRecord(post),
      analysis: toAnalysisRecord(analysis, brief),
      lessons: lessons.map((lesson) => toLessonRecord(lesson)),
      patterns: patterns.map((pattern) => toPatternRecord(pattern)),
      brief: toBriefRecord(brief),
    };
  },
});



export const trigger = authMutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await getOwnedPostOrThrow(ctx, args.postId);

    await ensureNoActiveAnalysis(ctx, args.postId);

    const metrics = await getMetrics(ctx, args.postId);

    const now = Date.now();
    const snapshot = {
      post: toAnalysisSnapshotPost(post),
      metrics: toAnalysisSnapshotMetrics(metrics),
    };

    const analysisId = await ctx.db.insert("analyses", {
      postId: args.postId,
      status: ANALYSIS_STATUS.IN_PROGRESS,
      isStale: false,
      snapshot: snapshot,
      startedAt: now,
      updatedAt: now,
    });

    await ctx.scheduler.runAfter(0, internal.internal.analyses.actions.runAnalysis, {
      analysisId,
    });

    const analysis = await getAnalysisOrThrow(ctx, analysisId)

    return toAnalysisRecord(analysis);
  },
});