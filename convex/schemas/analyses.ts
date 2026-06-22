
import { defineTable } from "convex/server"
import { v } from "convex/values"
import { ANALYSIS_STATUS } from "../lib/constants"
import { omit } from "../lib/utils"
import { postFields } from "./posts"
import { metricsFields } from "./metrics"

export const analysisFields = {
    postId: v.id("posts"),
    status: v.union(
        v.literal(ANALYSIS_STATUS.IN_PROGRESS),
        v.literal(ANALYSIS_STATUS.COMPLETED),
        v.literal(ANALYSIS_STATUS.FAILED)
    ),
    isStale: v.boolean(),
    snapshot: v.object({
        post: v.object(omit(postFields, ["userId", "updatedAt"])),
        metrics: v.object(omit(metricsFields, ["postId", "updatedAt"])),
    }),
    content: v.optional(v.string()),
    reasoning: v.optional(v.string()),
    confidence: v.optional(
        v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    errorMessage: v.optional(v.string()),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    updatedAt: v.number(),
}

export const analysesTable = defineTable(analysisFields)
    .index("by_postId", ["postId"])
    .index("by_postId_and_status", ["postId", "status"])
