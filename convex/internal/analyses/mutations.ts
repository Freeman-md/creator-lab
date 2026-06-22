import { v } from "convex/values";
import { internalMutation } from "../triggers";
import { ANALYSIS_STATUS } from "../../lib/constants";

export const insert = internalMutation({
  args: {
    postId: v.id("posts"),
    snapshot: v.object({
      post: v.object({
        title: v.optional(v.string()),
        body: v.string(),
        publishedDateTime: v.string(),
        goal: v.string(),
        category: v.string(),
        audience: v.string(),
      }),
      metrics: v.object({
        impressions: v.number(),
        reactions: v.number(),
        comments: v.number(),
        reposts: v.number(),
        profileVisits: v.number(),
      }),
    }),
    startedAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analyses", {
      postId: args.postId,
      status: ANALYSIS_STATUS.IN_PROGRESS,
      isStale: false,
      snapshot: args.snapshot,
      startedAt: args.startedAt,
      updatedAt: args.updatedAt,
    });
  },
});

export const patch = internalMutation({
  args: {
    analysisId: v.id("analyses"),
    status: v.union(
      v.literal(ANALYSIS_STATUS.COMPLETED),
      v.literal(ANALYSIS_STATUS.FAILED)
    ),
    isStale: v.boolean(),
    content: v.optional(v.string()),
    reasoning: v.optional(v.string()),
    confidence: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high")
      )
    ),
    errorMessage: v.optional(v.string()),
    completedAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.analysisId, {
      status: args.status,
      isStale: args.isStale,
      content: args.content,
      reasoning: args.reasoning,
      confidence: args.confidence,
      errorMessage: args.errorMessage,
      completedAt: args.completedAt,
      updatedAt: args.updatedAt,
    });
  },
});
