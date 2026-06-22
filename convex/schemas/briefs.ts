import { v } from "convex/values";
import { lessonFields } from "./lessons";
import { patternFields } from "./patterns";
import { defineTable } from "convex/server";
import { BRIEF_STATUS } from "../lib/constants";
import { omit } from "../lib/utils";
import { postFields } from "./posts";

export const briefFields = {
    postId: v.id("posts"),
    analysisId: v.id("analyses"),
    status: v.union(
        v.literal(BRIEF_STATUS.IN_PROGRESS),
        v.literal(BRIEF_STATUS.COMPLETED),
        v.literal(BRIEF_STATUS.FAILED)
    ),
    input: v.object({
        sourcePost: v.object(omit(postFields, ["userId", "updatedAt"])),
        analysis: v.object({
            content: v.string(),
            reasoning: v.string(),
            confidence: v.union(
                v.literal("low"),
                v.literal("medium"),
                v.literal("high")
            ),
        }),
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
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    updatedAt: v.number(),
}

export const briefsTable = defineTable(briefFields)
    .index("by_postId", ["postId"])
    .index("by_analysisId", ["analysisId"])
