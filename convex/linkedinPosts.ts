import { internal } from "./_generated/api";

import { authMutation, authQuery } from "./server";
import { getLinkedInPostSyncByUserId, getProfileByUserId } from "./lib/reads";
import { toLinkedInPostSyncRecord } from "./lib/mappers";

export const getSyncStatus = authQuery({
  args: {},
  handler: async (ctx) => {
    const sync = await getLinkedInPostSyncByUserId(ctx, ctx.userId);
    return toLinkedInPostSyncRecord(sync);
  },
});

export const triggerSync = authMutation({
  args: {},
  handler: async (ctx) => {
    const profile = await getProfileByUserId(ctx, ctx.userId);

    if (!profile?.linkedinProfileUrl) {
      throw new Error("Add your LinkedIn profile URL before syncing posts.");
    }

    await ctx.runMutation(
      internal.internal.linkedinPosts.mutations.markSyncStarted,
      { userId: ctx.userId }
    );

    await ctx.scheduler.runAfter(
      0,
      internal.internal.linkedinPosts.actions.runSync,
      {
        userId: ctx.userId,
        linkedinProfileUrl: profile.linkedinProfileUrl,
        linkedinPublicIdentifier: profile.linkedinPublicIdentifier,
        linkedinAuthorId: profile.linkedinAuthorId,
      }
    );

    const sync = await getLinkedInPostSyncByUserId(ctx, ctx.userId);
    return toLinkedInPostSyncRecord(sync);
  },
});
