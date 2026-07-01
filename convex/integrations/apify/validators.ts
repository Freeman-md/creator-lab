import { v } from "convex/values";

export const linkedinImportCountsValidator = v.object({
  fetched: v.number(),
  imported: v.number(),
  skippedDuplicate: v.number(),
  skippedInvalid: v.number(),
  skippedRepost: v.number(),
  skippedNonOwned: v.number(),
  metricsUpdated: v.number(),
  failed: v.number(),
});

export const normalizedLinkedInPostValidator = v.object({
  body: v.string(),
  publishedDateTime: v.string(),
  linkedinPostId: v.string(),
  linkedinUrl: v.string(),
  authorId: v.optional(v.string()),
  authorPublicIdentifier: v.optional(v.string()),
  metrics: v.object({
    impressions: v.number(),
    reactions: v.number(),
    likes: v.number(),
    comments: v.number(),
    reposts: v.number(),
    shares: v.number(),
    profileVisits: v.number(),
    reactionBreakdown: v.record(v.string(), v.number()),
  }),
});
