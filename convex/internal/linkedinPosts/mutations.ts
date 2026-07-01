import { v } from "convex/values";

import { Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";
import { getMetrics, getLinkedInPostSyncByUserId, getProfileByUserId } from "../../lib/reads";
import {
  LINKEDIN_POST_SYNC_STATUS,
} from "../../schemas/linkedinPostSyncs";
import {
  linkedinImportCountsValidator,
  normalizedLinkedInPostValidator,
} from "../../integrations/apify/validators";
import { internalMutation } from "../triggers";

type NormalizedLinkedInPost = {
  body: string;
  publishedDateTime: string;
  linkedinPostId: string;
  linkedinUrl: string;
  authorId?: string;
  authorPublicIdentifier?: string;
  metrics: {
    impressions: number;
    reactions: number;
    likes: number;
    comments: number;
    reposts: number;
    shares: number;
    profileVisits: number;
    reactionBreakdown: Record<string, number>;
  };
};

type ImportCounts = {
  fetched: number;
  imported: number;
  skippedDuplicate: number;
  skippedInvalid: number;
  skippedRepost: number;
  skippedNonOwned: number;
  metricsUpdated: number;
  failed: number;
};

const zeroCounts = (): ImportCounts => ({
  fetched: 0,
  imported: 0,
  skippedDuplicate: 0,
  skippedInvalid: 0,
  skippedRepost: 0,
  skippedNonOwned: 0,
  metricsUpdated: 0,
  failed: 0,
});

export const markSyncStarted = internalMutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await getLinkedInPostSyncByUserId(ctx, args.userId);

    if (existing?.status === LINKEDIN_POST_SYNC_STATUS.IN_PROGRESS) {
      throw new Error("LinkedIn post sync is already in progress.");
    }

    const now = Date.now();
    const payload = {
      userId: args.userId,
      status: LINKEDIN_POST_SYNC_STATUS.IN_PROGRESS,
      startedAt: now,
      lastSuccessfulSyncAt: existing?.lastSuccessfulSyncAt,
      ...zeroCounts(),
    };

    if (existing) {
      await ctx.db.replace(existing._id, payload);
      return existing._id;
    }

    return await ctx.db.insert("linkedinPostSyncs", payload);
  },
});

export const markSyncCompleted = internalMutation({
  args: {
    userId: v.string(),
    counts: linkedinImportCountsValidator,
  },
  handler: async (ctx, args) => {
    const existing = await getLinkedInPostSyncByUserId(ctx, args.userId);
    const now = Date.now();
    const payload = {
      userId: args.userId,
      status: LINKEDIN_POST_SYNC_STATUS.COMPLETED,
      startedAt: existing?.startedAt,
      completedAt: now,
      lastSuccessfulSyncAt: now,
      ...args.counts,
    };

    if (existing) {
      await ctx.db.replace(existing._id, payload);
      return existing._id;
    }

    return await ctx.db.insert("linkedinPostSyncs", payload);
  },
});

export const markSyncFailed = internalMutation({
  args: {
    userId: v.string(),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await getLinkedInPostSyncByUserId(ctx, args.userId);
    const now = Date.now();
    const counts = existing ?? zeroCounts();
    const payload = {
      userId: args.userId,
      status: LINKEDIN_POST_SYNC_STATUS.FAILED,
      startedAt: existing?.startedAt,
      completedAt: now,
      lastSuccessfulSyncAt: existing?.lastSuccessfulSyncAt,
      errorMessage: args.errorMessage,
      fetched: counts.fetched,
      imported: counts.imported,
      skippedDuplicate: counts.skippedDuplicate,
      skippedInvalid: counts.skippedInvalid,
      skippedRepost: counts.skippedRepost,
      skippedNonOwned: counts.skippedNonOwned,
      metricsUpdated: counts.metricsUpdated,
      failed: counts.failed + 1,
    };

    if (existing) {
      await ctx.db.replace(existing._id, payload);
      return existing._id;
    }

    return await ctx.db.insert("linkedinPostSyncs", payload);
  },
});

export const importForUser = internalMutation({
  args: {
    userId: v.string(),
    posts: v.array(normalizedLinkedInPostValidator),
  },
  handler: async (ctx, args) => {
    const counts = zeroCounts();
    const profile = await getProfileByUserId(ctx, args.userId);
    let profileAuthorId = profile?.linkedinAuthorId;
    let profilePublicIdentifier = profile?.linkedinPublicIdentifier;

    for (const post of args.posts) {
      const existing = await getExistingImportedPost(ctx, args.userId, post);

      if (existing) {
        counts.skippedDuplicate += 1;
        counts.metricsUpdated += await upsertMetrics(ctx, existing._id, post);
        await patchMissingImportMetadata(ctx, existing._id, post);
      } else {
        const postId = await ctx.db.insert("posts", {
          userId: args.userId,
          body: post.body,
          publishedDateTime: post.publishedDateTime,
          goal: "Imported from LinkedIn",
          category: "LinkedIn post",
          audience: "LinkedIn audience",
          linkedinPostId: post.linkedinPostId,
          linkedinUrl: post.linkedinUrl,
          source: "linkedin_import",
          importedAt: Date.now(),
          updatedAt: Date.now(),
        });

        counts.imported += 1;
        counts.metricsUpdated += await upsertMetrics(ctx, postId, post);
      }

      profileAuthorId = profileAuthorId ?? post.authorId;
      profilePublicIdentifier =
        profilePublicIdentifier ?? post.authorPublicIdentifier;
    }

    if (
      profile &&
      (profileAuthorId !== profile.linkedinAuthorId ||
        profilePublicIdentifier !== profile.linkedinPublicIdentifier)
    ) {
      await ctx.db.patch(profile._id, {
        linkedinAuthorId: profileAuthorId,
        linkedinPublicIdentifier: profilePublicIdentifier,
        updatedAt: Date.now(),
      });
    }

    return counts;
  },
});

async function getExistingImportedPost(
  ctx: MutationCtx,
  userId: string,
  post: NormalizedLinkedInPost
) {
  const byPostId = await ctx.db
    .query("posts")
    .withIndex("by_userId_and_linkedinPostId", (q) =>
      q.eq("userId", userId).eq("linkedinPostId", post.linkedinPostId)
    )
    .unique();

  if (byPostId) {
    return byPostId;
  }

  return await ctx.db
    .query("posts")
    .withIndex("by_userId_and_linkedinUrl", (q) =>
      q.eq("userId", userId).eq("linkedinUrl", post.linkedinUrl)
    )
    .unique();
}

async function patchMissingImportMetadata(
  ctx: MutationCtx,
  postId: Id<"posts">,
  post: NormalizedLinkedInPost
) {
  const existing = await ctx.db.get(postId);

  if (!existing) {
    return;
  }

  const patch: Partial<{
    linkedinPostId: string;
    linkedinUrl: string;
    source: "linkedin_import";
    importedAt: number;
  }> = {};

  if (!existing.linkedinPostId) patch.linkedinPostId = post.linkedinPostId;
  if (!existing.linkedinUrl) patch.linkedinUrl = post.linkedinUrl;
  if (!existing.source) patch.source = "linkedin_import";
  if (!existing.importedAt) patch.importedAt = Date.now();

  if (Object.keys(patch).length > 0) {
    await ctx.db.patch(postId, patch);
  }
}

async function upsertMetrics(
  ctx: MutationCtx,
  postId: Id<"posts">,
  post: NormalizedLinkedInPost
) {
  const payload = {
    impressions: post.metrics.impressions,
    reactions: post.metrics.reactions,
    likes: post.metrics.likes,
    comments: post.metrics.comments,
    reposts: post.metrics.reposts,
    shares: post.metrics.shares,
    profileVisits: post.metrics.profileVisits,
    reactionBreakdown: post.metrics.reactionBreakdown,
    updatedAt: Date.now(),
  };
  const existing = await getMetrics(ctx, postId);

  if (existing) {
    await ctx.db.patch(existing._id, payload);
  } else {
    await ctx.db.insert("metrics", {
      postId,
      ...payload,
    });
  }

  return 1;
}
