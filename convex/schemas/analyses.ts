
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { omit } from "../lib/utils"
import { postFields } from "./posts"
import { metricsFields } from "./metrics"

export const analysisFields = {
    postId: v.id("posts"),
    status: v.union(
        v.literal("in_progress"),
        v.literal("completed"),
        v.literal("failed")
    ),
    snapshot: v.object({
        post: v.object(omit(postFields, ["userId", "createdAt", "updatedAt"])),
        metrics: v.object(omit(metricsFields, ["postId", "createdAt", "updatedAt"])),
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
}

export const analysesTable = defineTable(analysisFields)
    .index("by_postId", ["postId"])
    .index("by_postId_and_createdAt", ["postId", "createdAt"])
    .index("by_postId_and_status", ["postId", "status"])
