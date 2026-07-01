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
    linkedinPostId: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    source: v.optional(v.union(v.literal("manual"), v.literal("linkedin_import"))),
    importedAt: v.optional(v.number()),
    updatedAt: v.number(),
}

export const postsTable = defineTable(postFields)
    .index("by_userId_and_publishedDateTime", ["userId", "publishedDateTime"])
    .index("by_userId_and_linkedinPostId", ["userId", "linkedinPostId"])
    .index("by_userId_and_linkedinUrl", ["userId", "linkedinUrl"])
    .index("by_publishedDateTime", ["publishedDateTime"])
    .index("by_updatedAt", ["updatedAt"])
