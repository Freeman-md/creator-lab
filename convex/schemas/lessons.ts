import { defineTable } from "convex/server";
import { v } from "convex/values";

export const lessonFields = {
    postId: v.id("posts"),
    analysisId: v.id("analyses"),
    type: v.union(v.literal("repeat"), v.literal("avoid"), v.literal("improve")),
    content: v.string(),
    createdAt: v.string(),
};

export const lessonsTable = defineTable(lessonFields)
    .index("by_analysisId", ["analysisId"])
    .index("by_postId", ["postId"])