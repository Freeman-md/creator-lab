import { v } from "convex/values";

import { api, internal } from "./_generated/api";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

function getMetricsSnapshot(metrics: Doc<"metrics"> | null) {
  return {
    impressions: metrics?.impressions ?? 0,
    reactions: metrics?.reactions ?? 0,
    comments: metrics?.comments ?? 0,
    reposts: metrics?.reposts ?? 0,
    profileVisits: metrics?.profileVisits ?? 0,
  };
}

function isAnalysisStale(
  analysis: Doc<"analyses">,
  post: Doc<"posts">,
  metrics: Doc<"metrics"> | null
) {
  if (!analysis.completedAt) {
    return false;
  }

  const completedAt = new Date(analysis.completedAt).getTime();
  const postUpdatedAt = new Date(post.updatedAt).getTime();
  const metricsUpdatedAt = metrics ? new Date(metrics.updatedAt).getTime() : 0;

  return postUpdatedAt > completedAt || metricsUpdatedAt > completedAt;
}

function toBriefRecord(brief: Doc<"briefs"> | null) {
  if (!brief) {
    return null;
  }

  return {
    id: brief._id,
    postId: brief.postId,
    analysisId: brief.analysisId,
    status: brief.status,
    input: brief.input,
    repeat: brief.repeat,
    avoid: brief.avoid,
    improve: brief.improve,
    nextPostAngle: brief.nextPostAngle,
    nextPostReason: brief.nextPostReason,
    nextPostReminder: brief.nextPostReminder,
    errorMessage: brief.errorMessage,
    startedAt: brief.startedAt,
    completedAt: brief.completedAt,
    createdAt: brief.createdAt,
    updatedAt: brief.updatedAt,
  };
}

function toAnalysisRecord(
  analysis: Doc<"analyses">,
  stale: boolean,
  brief?: Doc<"briefs"> | null
) {
  return {
    id: analysis._id,
    postId: analysis.postId,
    status: analysis.status,
    snapshot: analysis.snapshot,
    content: analysis.content,
    reasoning: analysis.reasoning,
    confidence: analysis.confidence,
    errorMessage: analysis.errorMessage,
    startedAt: analysis.startedAt,
    completedAt: analysis.completedAt,
    createdAt: analysis.createdAt,
    updatedAt: analysis.updatedAt,
    stale,
    brief: brief ? toBriefRecord(brief) : null,
  };
}

export const getAll = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found.");
    }

    const metrics = (
      await ctx.db
        .query("metrics")
        .withIndex("by_postId", (q) => q.eq("postId", args.postId))
        .collect()
    )[0] ?? null;

    const analyses = await ctx.db
      .query("analyses")
      .withIndex("by_postId_and_createdAt", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();

    return Promise.all(
      analyses.map(async (analysis) => {
        const brief = (
          await ctx.db
            .query("briefs")
            .withIndex("by_analysisId", (q) => q.eq("analysisId", analysis._id))
            .collect()
        )[0] ?? null;

        return toAnalysisRecord(
          analysis,
          isAnalysisStale(analysis, post, metrics),
          brief
        );
      })
    );
  },
});

export const get = query({
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
      throw new Error("Source post not found.");
    }

    const metrics = (
      await ctx.db
        .query("metrics")
        .withIndex("by_postId", (q) => q.eq("postId", analysis.postId))
        .collect()
    )[0] ?? null;

    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_analysisId", (q) => q.eq("analysisId", analysis._id))
      .collect();

    const patterns = await ctx.db
      .query("patterns")
      .withIndex("by_analysisId", (q) => q.eq("analysisId", analysis._id))
      .collect();

    const brief = (
      await ctx.db
        .query("briefs")
        .withIndex("by_analysisId", (q) => q.eq("analysisId", analysis._id))
        .collect()
    )[0] ?? null;

    return {
      post: {
        id: post._id,
        title: post.title,
        body: post.body,
        publishedDateTime: post.publishedDateTime,
        goal: post.goal,
        category: post.category,
        audience: post.audience,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
      analysis: toAnalysisRecord(
        analysis,
        isAnalysisStale(analysis, post, metrics),
        brief
      ),
      lessons: lessons.map((lesson) => ({
        id: lesson._id,
        postId: lesson.postId,
        analysisId: lesson.analysisId,
        type: lesson.type,
        content: lesson.content,
        createdAt: lesson.createdAt,
      })),
      patterns: patterns.map((pattern) => ({
        id: pattern._id,
        postId: pattern.postId,
        analysisId: pattern.analysisId,
        sentiment: pattern.sentiment,
        score: pattern.score,
        name: pattern.name,
        description: pattern.description,
        createdAt: pattern.createdAt,
      })),
      brief: toBriefRecord(brief),
    };
  },
});

export const trigger = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found.");
    }

    const inProgress = await ctx.db
      .query("analyses")
      .withIndex("by_postId_and_status", (q) =>
        q.eq("postId", args.postId).eq("status", "in_progress")
      )
      .collect();

    if (inProgress.length > 0) {
      throw new Error("An analysis is already in progress for this post.");
    }

    const metrics = (
      await ctx.db
        .query("metrics")
        .withIndex("by_postId", (q) => q.eq("postId", args.postId))
        .collect()
    )[0] ?? null;

    const now = new Date().toISOString();
    const snapshot = {
      post: {
        id: post._id,
        title: post.title,
        body: post.body,
        publishedDateTime: post.publishedDateTime,
        goal: post.goal,
        category: post.category,
        audience: post.audience,
      },
      metrics: getMetricsSnapshot(metrics),
    };

    const analysisId = await ctx.db.insert("analyses", {
      postId: args.postId,
      status: "in_progress",
      snapshot,
      startedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.scheduler.runAfter(0, internal.internal.analysisJobs.runAnalysis, {
      analysisId,
    });

    const analysis = await ctx.db.get(analysisId);
    if (!analysis) {
      throw new Error("Analysis trigger failed.");
    }

    return toAnalysisRecord(analysis, false);
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
        v.object({
          type: v.union(
            v.literal("repeat"),
            v.literal("avoid"),
            v.literal("improve")
          ),
          content: v.string(),
        })
      ),
      patterns: v.array(
        v.object({
          sentiment: v.union(v.literal("positive"), v.literal("negative")),
          score: v.number(),
          name: v.string(),
          description: v.string(),
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    const analysis = await ctx.db.get(args.analysisId);
    if (!analysis) {
      throw new Error("Analysis not found.");
    }
    if (analysis.status !== "in_progress") {
      throw new Error("Only in-progress analyses can be completed.");
    }

    const now = new Date().toISOString();
    await ctx.db.patch(args.analysisId, {
      status: "completed",
      content: args.output.summary.content,
      reasoning: args.output.summary.reasoning,
      confidence: args.output.summary.confidence,
      completedAt: now,
      updatedAt: now,
    });

    const existingLessons = await ctx.db
      .query("lessons")
      .withIndex("by_analysisId", (q) => q.eq("analysisId", args.analysisId))
      .collect();
    for (const lesson of existingLessons) {
      await ctx.db.delete(lesson._id);
    }

    const existingPatterns = await ctx.db
      .query("patterns")
      .withIndex("by_analysisId", (q) => q.eq("analysisId", args.analysisId))
      .collect();
    for (const pattern of existingPatterns) {
      await ctx.db.delete(pattern._id);
    }

    for (const lesson of args.output.lessons) {
      await ctx.db.insert("lessons", {
        postId: analysis.postId,
        analysisId: args.analysisId,
        type: lesson.type,
        content: lesson.content,
        createdAt: now,
      });
    }

    for (const pattern of args.output.patterns) {
      await ctx.db.insert("patterns", {
        postId: analysis.postId,
        analysisId: args.analysisId,
        sentiment: pattern.sentiment,
        score: pattern.score,
        name: pattern.name,
        description: pattern.description,
        createdAt: now,
      });
    }

    await ctx.runMutation(api.briefs.create, {
      analysisId: args.analysisId,
    });

    const completed = await ctx.db.get(args.analysisId);
    if (!completed) {
      throw new Error("Analysis completion failed.");
    }

    return toAnalysisRecord(completed, false);
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

    const now = new Date().toISOString();
    await ctx.db.patch(args.analysisId, {
      status: "failed",
      errorMessage: args.errorMessage,
      completedAt: now,
      updatedAt: now,
    });

    const failed = await ctx.db.get(args.analysisId);
    if (!failed) {
      throw new Error("Analysis failure state was not saved.");
    }

    return toAnalysisRecord(failed, false);
  },
});
