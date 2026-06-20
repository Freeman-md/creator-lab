import { v } from "convex/values";
import { defineTable } from "convex/server";

export const metricsFields = {
  postId: v.id("posts"),
  impressions: v.number(),
  reactions: v.number(),
  comments: v.number(),
  reposts: v.number(),
  profileVisits: v.number(),
  createdAt: v.string(),
  updatedAt: v.string(),
}

export const metricsTable = defineTable(metricsFields).index("by_postId", ["postId"])