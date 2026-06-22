import { defineTable } from "convex/server";
import { v } from "convex/values";

export const lesson = {
    type: v.union(v.literal("repeat"), v.literal("avoid"), v.literal("improve")),
    content: v.string()
}

export const lessonFields = {
    postId: v.id("posts"),
    analysisId: v.id("analyses"),
    ...lesson
};

export const lessonsTable = defineTable(lessonFields)
    .index("by_analysisId", ["analysisId"])
    .index("by_postId", ["postId"])
