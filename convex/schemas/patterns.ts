import { defineTable } from "convex/server";
import { v } from "convex/values";

export const pattern = {
  sentiment: v.union(v.literal("positive"), v.literal("negative")),
  score: v.number(),
  name: v.string(),
  description: v.string()
}

export const patternFields = {
  postId: v.id("posts"),
  analysisId: v.id("analyses"),
  ...pattern
};

export const patternsTable = defineTable(patternFields)
    .index("by_analysisId", ["analysisId"])
    .index("by_postId", ["postId"])
