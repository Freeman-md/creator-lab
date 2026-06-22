import { v } from "convex/values";

import { api, internal } from "./_generated/api";
import { authMutation, authQuery, internalQuery, mutation } from "./server";
import { Id } from "./_generated/dataModel";
import { ANALYSIS_STATUS } from "./lib/constants";
import { ensureNoActiveAnalysis, getBrief, getLessons, getMetrics, getOwnedAnalysis, getOwnedPost, getPatterns } from "./lib/helpers";
import { toAnalysisRecord, toAnalysisSnapshotMetrics, toAnalysisSnapshotPost, toBriefRecord, toLessonRecord, toPatternRecord, toPostRecord } from "./lib/mappers";
import { lesson } from "./schemas/lessons";
import { pattern } from "./schemas/patterns";

export const getAll = authQuery({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    await getOwnedPost(ctx, args.postId);

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
    const { analysis, post } = await getOwnedAnalysis(ctx, args.analysisId);

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

export const getInternal = internalQuery({
  args: {
    analysisId: v.id("analyses"),
  },
  handler: async (ctx, args) => {
    const analysis = await ctx.db.get(args.analysisId);

    if (!analysis) {
      throw new Error("Analysis not found.");
    }

    const post = await ctx.db.get(analysis.postId);

    if (!post) {
      throw new Error("Post not found.");
    }

    return {
      post: toPostRecord(post),
      analysis: toAnalysisRecord(analysis),
    };
  },
});



export const trigger = authMutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await getOwnedPost(ctx, args.postId);

    await ensureNoActiveAnalysis(ctx, args.postId);

    const metrics = await getMetrics(ctx, args.postId);

    const now = Date.now();
    const snapshot = {
      post: toAnalysisSnapshotPost(post),
      metrics: toAnalysisSnapshotMetrics(metrics),
    };

    const analysisId: Id<"analyses"> = await ctx.runMutation(
      internal.internal.analyses.mutations.insert,
      {
        postId: args.postId,
        snapshot,
        startedAt: now,
        updatedAt: now,
      }
    );

    await ctx.scheduler.runAfter(0, internal.internal.analyses.actions.runAnalysis, {
      analysisId,
    });

    const analysis = await ctx.db.get(analysisId);

    return toAnalysisRecord(analysis!);
  },
});

export const complete = mutation({
  args: {
    analysisId: v.id("analyses"),
    output: v.object({
      summary: v.object({
        content: v.string(),
        reasoning: v.string(),
        confidence: v.union(
          v.literal("low"),
          v.literal("medium"),
          v.literal("high")
        ),
      }),
      lessons: v.array(
        v.object(lesson)
      ),
      patterns: v.array(
        v.object(pattern)
      ),
    }),
  },
  handler: async (ctx, args) => {
    const analysis = await ctx.db.get(args.analysisId);
    if (!analysis) {
      throw new Error("Analysis not found.");
    }
    if (analysis.status !== ANALYSIS_STATUS.IN_PROGRESS) {
      throw new Error("Only in-progress analyses can be completed.");
    }

    const now = Date.now();
    await ctx.runMutation(internal.internal.analyses.mutations.patch, {
      analysisId: args.analysisId,
      status: ANALYSIS_STATUS.COMPLETED,
      isStale: false,
      content: args.output.summary.content,
      reasoning: args.output.summary.reasoning,
      confidence: args.output.summary.confidence,
      completedAt: now,
      updatedAt: now,
    });

    await Promise.all([
      await ctx.runMutation(internal.lessons.replaceForAnalysis, {
        postId: analysis.postId,
        analysisId: args.analysisId,
        lessons: args.output.lessons,
      }),

      await ctx.runMutation(internal.patterns.replaceForAnalysis, {
        postId: analysis.postId,
        analysisId: args.analysisId,
        patterns: args.output.patterns,
      })
    ])

    await ctx.runMutation(api.briefs.create, {
      analysisId: args.analysisId,
    });

    const completed = await ctx.db.get(args.analysisId);

    if (!completed) {
      throw new Error("Analysis completion failed.");
    }

    return toAnalysisRecord(completed);
  },
});

export const fail = mutation({
  args: {
    analysisId: v.id("analyses"),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const analysis = await ctx.db.get(args.analysisId);
    if (!analysis) {
      throw new Error("Analysis not found.");
    }

    const now = Date.now();
    await ctx.runMutation(internal.internal.analyses.mutations.patch, {
      analysisId: args.analysisId,
      status: ANALYSIS_STATUS.FAILED,
      isStale: false,
      errorMessage: args.errorMessage,
      completedAt: now,
      updatedAt: now,
    });

    const failed = await ctx.db.get(args.analysisId);
    if (!failed) {
      throw new Error("Analysis failure state was not saved.");
    }

    return toAnalysisRecord(failed);
  },
});
