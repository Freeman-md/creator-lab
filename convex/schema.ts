import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const postFields = {
  title: v.optional(v.string()),
  body: v.string(),
  publishedDateTime: v.string(),
  goal: v.string(),
  category: v.string(),
  audience: v.string(),
  createdAt: v.string(),
  updatedAt: v.string(),
};

const metricsFields = {
  postId: v.id("posts"),
  impressions: v.number(),
  reactions: v.number(),
  comments: v.number(),
  reposts: v.number(),
  profileVisits: v.number(),
  createdAt: v.string(),
  updatedAt: v.string(),
};

const analysisSummaryFields = {
  content: v.string(),
  reasoning: v.string(),
  confidence: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
};

const lessonFields = {
  postId: v.id("posts"),
  analysisId: v.id("analyses"),
  type: v.union(v.literal("repeat"), v.literal("avoid"), v.literal("improve")),
  content: v.string(),
  createdAt: v.string(),
};

const patternFields = {
  postId: v.id("posts"),
  analysisId: v.id("analyses"),
  sentiment: v.union(v.literal("positive"), v.literal("negative")),
  score: v.number(),
  name: v.string(),
  description: v.string(),
  createdAt: v.string(),
};

export default defineSchema({
  posts: defineTable(postFields)
    .index("by_publishedDateTime", ["publishedDateTime"])
    .index("by_updatedAt", ["updatedAt"]),
  metrics: defineTable(metricsFields)
    .index("by_postId", ["postId"]),
  analyses: defineTable({
    postId: v.id("posts"),
    status: v.union(
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("failed")
    ),
    snapshot: v.object({
      post: v.object(postFields),
      metrics: v.object({
        impressions: v.number(),
        reactions: v.number(),
        comments: v.number(),
        reposts: v.number(),
        profileVisits: v.number(),
      }),
    }),
    content: v.optional(v.string()),
    reasoning: v.optional(v.string()),
    confidence: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    errorMessage: v.optional(v.string()),
    startedAt: v.string(),
    completedAt: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_postId", ["postId"])
    .index("by_postId_and_createdAt", ["postId", "createdAt"])
    .index("by_postId_and_status", ["postId", "status"]),
  lessons: defineTable(lessonFields)
    .index("by_analysisId", ["analysisId"])
    .index("by_postId", ["postId"]),
  patterns: defineTable(patternFields)
    .index("by_analysisId", ["analysisId"])
    .index("by_postId", ["postId"]),
  briefs: defineTable({
    postId: v.id("posts"),
    analysisId: v.id("analyses"),
    status: v.union(
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("failed")
    ),
    input: v.object({
      sourcePost: v.object({
        id: v.string(),
        title: v.optional(v.string()),
        body: v.string(),
        goal: v.string(),
        category: v.string(),
        audience: v.string(),
      }),
      analysis: v.object(analysisSummaryFields),
      lessons: v.array(
        v.object({
          type: lessonFields.type,
          content: v.string(),
        })
      ),
      patterns: v.array(
        v.object({
          sentiment: patternFields.sentiment,
          score: v.number(),
          name: v.string(),
          description: v.string(),
        })
      ),
    }),
    repeat: v.optional(v.array(v.string())),
    avoid: v.optional(v.array(v.string())),
    improve: v.optional(v.array(v.string())),
    nextPostAngle: v.optional(v.string()),
    nextPostReason: v.optional(v.string()),
    nextPostReminder: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    startedAt: v.string(),
    completedAt: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_postId", ["postId"])
    .index("by_analysisId", ["analysisId"]),
});
