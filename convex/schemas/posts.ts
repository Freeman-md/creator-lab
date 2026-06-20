import { v } from 'convex/values'
import { defineTable } from "convex/server";

export const postFields = {
    userId: v.string(),
    title: v.optional(v.string()),
    body: v.string(),
    publishedDateTime: v.string(),
    goal: v.string(),
    category: v.string(),
    audience: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
}

export const postsTable = defineTable(postFields)
                            .index("by_userId_and_publishedDateTime", ["userId", "publishedDateTime"])
                            .index("by_publishedDateTime", ["publishedDateTime"])
                            .index("by_updatedAt", ["updatedAt"])