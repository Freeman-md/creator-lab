import { v } from "convex/values";
import { defineTable } from "convex/server";

export const metricsFields = {
  postId: v.id("posts"),
  impressions: v.number(),
  reactions: v.number(),
  likes: v.optional(v.number()),
  comments: v.number(),
  reposts: v.number(),
  shares: v.optional(v.number()),
  profileVisits: v.number(),
  reactionBreakdown: v.optional(v.record(v.string(), v.number())),
  updatedAt: v.number(),
}

export const metricsTable = defineTable(metricsFields).index("by_postId", ["postId"])
