import { defineTable } from "convex/server";
import { v } from "convex/values";

export const LINKEDIN_POST_SYNC_STATUS = {
  IDLE: "idle",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export const linkedinPostSyncCountFields = {
  fetched: v.number(),
  imported: v.number(),
  skippedDuplicate: v.number(),
  skippedInvalid: v.number(),
  skippedRepost: v.number(),
  skippedNonOwned: v.number(),
  metricsUpdated: v.number(),
  failed: v.number(),
};

export const linkedinPostSyncFields = {
  userId: v.string(),
  status: v.union(
    v.literal(LINKEDIN_POST_SYNC_STATUS.IDLE),
    v.literal(LINKEDIN_POST_SYNC_STATUS.IN_PROGRESS),
    v.literal(LINKEDIN_POST_SYNC_STATUS.COMPLETED),
    v.literal(LINKEDIN_POST_SYNC_STATUS.FAILED)
  ),
  startedAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),
  lastSuccessfulSyncAt: v.optional(v.number()),
  errorMessage: v.optional(v.string()),
  ...linkedinPostSyncCountFields,
};

export const linkedinPostSyncsTable = defineTable(
  linkedinPostSyncFields
).index("by_userId", ["userId"]);
