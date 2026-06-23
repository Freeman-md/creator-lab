import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

import { authMutation, authQuery } from "./server";
import { getMetrics } from "./lib/reads";
import { toMetricsRecord } from "./lib/mappers";
import { getOwnedPostOrThrow } from "./lib/ownership";

type UpsertMetricsArgs = {
  postId: Id<"posts">;
  impressions?: number;
  reactions?: number;
  comments?: number;
  reposts?: number;
  profileVisits?: number;
};

type MetricsPatchPayload = {
  impressions?: number;
  reactions?: number;
  comments?: number;
  reposts?: number;
  profileVisits?: number;
  updatedAt: number;
};

function getUpsertPayload(args: UpsertMetricsArgs): MetricsPatchPayload {
  const payload: MetricsPatchPayload = {
    updatedAt: Date.now(),
  };

  if (args.impressions !== undefined) payload.impressions = args.impressions;
  if (args.reactions !== undefined) payload.reactions = args.reactions;
  if (args.comments !== undefined) payload.comments = args.comments;
  if (args.reposts !== undefined) payload.reposts = args.reposts;
  if (args.profileVisits !== undefined) {
    payload.profileVisits = args.profileVisits;
  }

  return payload;
}

export const getByPost = authQuery({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    await getOwnedPostOrThrow(ctx, args.postId);
    return await getMetrics(ctx, args.postId);
  },
});

export const upsert = authMutation({
  args: {
    postId: v.id("posts"),
    impressions: v.optional(v.number()),
    reactions: v.optional(v.number()),
    comments: v.optional(v.number()),
    reposts: v.optional(v.number()),
    profileVisits: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await getOwnedPostOrThrow(ctx, args.postId);

    const payload = getUpsertPayload(args);
    const existing = await getMetrics(ctx, args.postId);

    let metricsId;

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      metricsId = existing._id;
    } else {
      metricsId = await ctx.db.insert("metrics", {
        postId: args.postId,
        impressions: args.impressions ?? 0,
        reactions: args.reactions ?? 0,
        comments: args.comments ?? 0,
        reposts: args.reposts ?? 0,
        profileVisits: args.profileVisits ?? 0,
        updatedAt: payload.updatedAt,
      });
    }

    const metrics = await ctx.db.get(metricsId);
    return toMetricsRecord(metrics);
  },
});
