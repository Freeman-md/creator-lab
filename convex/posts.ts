import { v } from "convex/values";

import { query, mutation, QueryCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

function toPostRecord(post: Doc<"posts">) {
  return {
    id: post._id,
    title: post.title,
    body: post.body,
    publishedDateTime: post.publishedDateTime,
    goal: post.goal,
    category: post.category,
    audience: post.audience,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function toMetricsRecord(metrics: Doc<"metrics"> | null) {
  if (!metrics) {
    return null;
  }

  return {
    id: metrics._id,
    postId: metrics.postId,
    impressions: metrics.impressions,
    reactions: metrics.reactions,
    comments: metrics.comments,
    reposts: metrics.reposts,
    profileVisits: metrics.profileVisits,
    createdAt: metrics.createdAt,
    updatedAt: metrics.updatedAt,
  };
}

function toAnalysisRecord(analysis: Doc<"analyses">, stale: boolean) {
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
  };
}

function toLessonRecord(lesson: Doc<"lessons">) {
  return {
    id: lesson._id,
    postId: lesson.postId,
    analysisId: lesson.analysisId,
    type: lesson.type,
    content: lesson.content,
    createdAt: lesson.createdAt,
  };
}

function toPatternRecord(pattern: Doc<"patterns">) {
  return {
    id: pattern._id,
    postId: pattern.postId,
    analysisId: pattern.analysisId,
    sentiment: pattern.sentiment,
    score: pattern.score,
    name: pattern.name,
    description: pattern.description,
    createdAt: pattern.createdAt,
  };
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

async function getLatestMetrics(ctx: QueryCtx, postId: Id<"posts">) {
  const metrics = await ctx.db
    .query("metrics")
    .withIndex("by_postId", (q) => q.eq("postId", postId))
    .collect();

  return metrics[0] ?? null;
}

async function getBriefForAnalysis(
  ctx: QueryCtx,
  analysisId: Id<"analyses">
) {
  const briefs = await ctx.db
    .query("briefs")
    .withIndex("by_analysisId", (q) => q.eq("analysisId", analysisId))
    .collect();

  return briefs[0] ?? null;
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

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_publishedDateTime")
      .order("desc")
      .collect();

    return Promise.all(
      posts.map(async (post) => {
        const metrics = await getLatestMetrics(ctx, post._id);
        const analyses = await ctx.db
          .query("analyses")
          .withIndex("by_postId_and_createdAt", (q) => q.eq("postId", post._id))
          .order("desc")
          .collect();
        const latestAnalysis = analyses[0] ?? null;
        const latestBrief = latestAnalysis
          ? await getBriefForAnalysis(ctx, latestAnalysis._id)
          : null;

        return {
          post: toPostRecord(post),
          metrics: toMetricsRecord(metrics),
          analysisCount: analyses.length,
          latestAnalysis: latestAnalysis
            ? toAnalysisRecord(
                latestAnalysis,
                isAnalysisStale(latestAnalysis, post, metrics)
              )
            : null,
          latestBrief: toBriefRecord(latestBrief),
        };
      })
    );
  },
});

export const get = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found.");
    }

    const metrics = await getLatestMetrics(ctx, post._id);
    const analyses = await ctx.db
      .query("analyses")
      .withIndex("by_postId_and_createdAt", (q) => q.eq("postId", post._id))
      .order("desc")
      .collect();

    const latestAnalysis = analyses[0] ?? null;
    const latestCompletedAnalysis =
      analyses.find((analysis) => analysis.status === "completed") ?? null;

    const latestLessons = latestCompletedAnalysis
      ? await ctx.db
          .query("lessons")
          .withIndex("by_analysisId", (q) =>
            q.eq("analysisId", latestCompletedAnalysis._id)
          )
          .collect()
      : [];

    const latestPatterns = latestCompletedAnalysis
      ? await ctx.db
          .query("patterns")
          .withIndex("by_analysisId", (q) =>
            q.eq("analysisId", latestCompletedAnalysis._id)
          )
          .collect()
      : [];

    const latestBrief = latestCompletedAnalysis
      ? await getBriefForAnalysis(ctx, latestCompletedAnalysis._id)
      : null;

    return {
      post: toPostRecord(post),
      metrics: toMetricsRecord(metrics),
      analyses: analyses.map((analysis) =>
        toAnalysisRecord(analysis, isAnalysisStale(analysis, post, metrics))
      ),
      latestAnalysis: latestAnalysis
        ? toAnalysisRecord(
            latestAnalysis,
            isAnalysisStale(latestAnalysis, post, metrics)
          )
        : null,
      latestCompletedAnalysis: latestCompletedAnalysis
        ? toAnalysisRecord(
            latestCompletedAnalysis,
            isAnalysisStale(latestCompletedAnalysis, post, metrics)
          )
        : null,
      latestLessons: latestLessons.map(toLessonRecord),
      latestPatterns: latestPatterns.map(toPatternRecord),
      latestBrief: toBriefRecord(latestBrief),
    };
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    body: v.string(),
    publishedDateTime: v.string(),
    goal: v.string(),
    category: v.string(),
    audience: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const postId = await ctx.db.insert("posts", {
      title: args.title?.trim() ? args.title.trim() : undefined,
      body: args.body.trim(),
      publishedDateTime: args.publishedDateTime,
      goal: args.goal.trim(),
      category: args.category.trim(),
      audience: args.audience.trim(),
      createdAt: now,
      updatedAt: now,
    });

    const post = await ctx.db.get(postId);
    if (!post) {
      throw new Error("Post creation failed.");
    }

    return toPostRecord(post);
  },
});

export const update = mutation({
  args: {
    postId: v.id("posts"),
    title: v.optional(v.string()),
    body: v.string(),
    publishedDateTime: v.string(),
    goal: v.string(),
    category: v.string(),
    audience: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found.");
    }

    const now = new Date().toISOString();
    await ctx.db.patch(args.postId, {
      title: args.title?.trim() ? args.title.trim() : undefined,
      body: args.body.trim(),
      publishedDateTime: args.publishedDateTime,
      goal: args.goal.trim(),
      category: args.category.trim(),
      audience: args.audience.trim(),
      updatedAt: now,
    });

    const updated = await ctx.db.get(args.postId);
    if (!updated) {
      throw new Error("Post update failed.");
    }

    return toPostRecord(updated);
  },
});
