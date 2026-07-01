"use node";

import { v } from "convex/values";

import { internal } from "../../_generated/api";
import { internalAction } from "../../_generated/server";
import { fetchLinkedInPostsForProfile } from "../../integrations/apify/services/linkedinPostSearch";
import { LinkedInImportCounts } from "../../integrations/apify/normalizers";

export const runSync = internalAction({
  args: {
    userId: v.string(),
    linkedinProfileUrl: v.string(),
    linkedinPublicIdentifier: v.optional(v.string()),
    linkedinAuthorId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const normalized = await fetchLinkedInPostsForProfile({
        linkedinProfileUrl: args.linkedinProfileUrl,
        linkedinPublicIdentifier: args.linkedinPublicIdentifier,
        linkedinAuthorId: args.linkedinAuthorId,
      });

      const importCounts: LinkedInImportCounts = await ctx.runMutation(
        internal.internal.linkedinPosts.mutations.importForUser,
        {
          userId: args.userId,
          posts: normalized.posts,
        }
      );

      await ctx.runMutation(
        internal.internal.linkedinPosts.mutations.markSyncCompleted,
        {
          userId: args.userId,
          counts: mergeCounts(normalized.counts, importCounts),
        }
      );
    } catch (error) {
      await ctx.runMutation(
        internal.internal.linkedinPosts.mutations.markSyncFailed,
        {
          userId: args.userId,
          errorMessage:
            error instanceof Error
              ? error.message
              : "LinkedIn post sync failed.",
        }
      );
    }
  },
});

function mergeCounts(
  first: LinkedInImportCounts,
  second: LinkedInImportCounts
): LinkedInImportCounts {
  return {
    fetched: first.fetched + second.fetched,
    imported: first.imported + second.imported,
    skippedDuplicate: first.skippedDuplicate + second.skippedDuplicate,
    skippedInvalid: first.skippedInvalid + second.skippedInvalid,
    skippedRepost: first.skippedRepost + second.skippedRepost,
    skippedNonOwned: first.skippedNonOwned + second.skippedNonOwned,
    metricsUpdated: first.metricsUpdated + second.metricsUpdated,
    failed: first.failed + second.failed,
  };
}
