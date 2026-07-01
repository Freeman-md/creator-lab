import { defineTable } from "convex/server";
import { v } from "convex/values";

export const profileFields = {
  userId: v.string(),
  linkedinProfileUrl: v.string(),
  linkedinPublicIdentifier: v.optional(v.string()),
  linkedinAuthorId: v.optional(v.string()),
  updatedAt: v.number(),
};

export const profilesTable = defineTable(profileFields).index("by_userId", [
  "userId",
]);
