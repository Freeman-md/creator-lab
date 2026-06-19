import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const upsert = mutation({
  args: {
    postId: v.id("posts"),
    impressions: v.optional(v.number()),
    reactions: v.optional(v.number()),
    comments: v.optional(v.number()),
    reposts: v.optional(v.number()),
    profileVisits: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found.");
    }

    const now = new Date().toISOString();
    const payload = {
      impressions: args.impressions ?? 0,
      reactions: args.reactions ?? 0,
      comments: args.comments ?? 0,
      reposts: args.reposts ?? 0,
      profileVisits: args.profileVisits ?? 0,
      updatedAt: now,
    };

    const existing = await ctx.db
      .query("metrics")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .collect();

    const metricsId =
      existing[0]?._id ??
      (await ctx.db.insert("metrics", {
        postId: args.postId,
        impressions: 0,
        reactions: 0,
        comments: 0,
        reposts: 0,
        profileVisits: 0,
        createdAt: now,
        updatedAt: now,
      }));

    await ctx.db.patch(metricsId, payload);

    const metrics = await ctx.db.get(metricsId);
    if (!metrics) {
      throw new Error("Metrics save failed.");
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
  },
});
