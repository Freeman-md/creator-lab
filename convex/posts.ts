import { v } from "convex/values";

import { authMutation, authQuery } from "./server";
import {
  getBrief,
  getLatestAnalysis,
  getMetrics,
  getPostOrThrow,
} from "./lib/reads";
import { toPostRecord, toMetricsRecord, toAnalysisRecord, toBriefRecord } from "./lib/mappers";
import { ANALYSIS_STATUS } from "./lib/constants";
import { getOwnedPostOrThrow } from "./lib/ownership";

export const getAll = authQuery({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_userId_and_publishedDateTime", (q) =>
        q.eq("userId", ctx.userId)
      )
      .order("desc")
      .collect();

    return Promise.all(
      posts.map(async (post) => {
        const [metrics, latestAnalysis] = await Promise.all([
          getMetrics(ctx, post._id),
          getLatestAnalysis(ctx, post._id),
        ]);

        const latestBrief =
          latestAnalysis && latestAnalysis.status === ANALYSIS_STATUS.COMPLETED
            ? await getBrief(ctx, latestAnalysis._id)
            : null;

        return {
          post: toPostRecord(post),
          metrics: toMetricsRecord(metrics),
          latestAnalysis: latestAnalysis
            ? toAnalysisRecord(latestAnalysis)
            : null,
          latestBrief: toBriefRecord(latestBrief),
        };
      })
    );
  },
});

export const get = authQuery({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const [post, metrics, latestAnalysis] = await Promise.all([
      getOwnedPostOrThrow(ctx, args.postId),
      getMetrics(ctx, args.postId),
      getLatestAnalysis(ctx, args.postId),
    ]);

    const latestBrief = latestAnalysis
      ? await getBrief(ctx, latestAnalysis._id)
      : null;

    return {
      post: toPostRecord(post),
      metrics: toMetricsRecord(metrics),
      latestAnalysis: latestAnalysis
        ? toAnalysisRecord(latestAnalysis)
        : null,
      latestBrief: toBriefRecord(latestBrief),
    };
  },
});

export const create = authMutation({
  args: {
    title: v.optional(v.string()),
    body: v.string(),
    publishedDateTime: v.string(),
    goal: v.string(),
    category: v.string(),
    audience: v.string(),
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("posts", {
      userId: ctx.userId,
      title: args.title?.trim() ? args.title.trim() : undefined,
      body: args.body.trim(),
      publishedDateTime: args.publishedDateTime,
      goal: args.goal.trim(),
      category: args.category.trim(),
      audience: args.audience.trim(),
      updatedAt: Date.now(),
    });

    const post = await getPostOrThrow(ctx, postId)

    return toPostRecord(post!);
  },
});

export const update = authMutation({
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
    await getOwnedPostOrThrow(ctx, args.postId);

    await ctx.db.patch(args.postId, {
      title: args.title?.trim() ? args.title.trim() : undefined,
      body: args.body.trim(),
      publishedDateTime: args.publishedDateTime,
      goal: args.goal.trim(),
      category: args.category.trim(),
      audience: args.audience.trim(),
      updatedAt: Date.now(),
    });

    const post = await getPostOrThrow(ctx, args.postId)

    return toPostRecord(post);
  },
});
