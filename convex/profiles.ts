import { v } from "convex/values";

import { authMutation, authQuery } from "./server";
import { getProfileByUserId } from "./lib/reads";
import { normalizeLinkedInProfileUrl } from "./lib/linkedin";
import { toProfileRecord } from "./lib/mappers";

export const getCurrent = authQuery({
  args: {},
  handler: async (ctx) => {
    const profile = await getProfileByUserId(ctx, ctx.userId);
    return toProfileRecord(profile);
  },
});

export const upsertLinkedInProfile = authMutation({
  args: {
    linkedinProfileUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const normalized = normalizeLinkedInProfileUrl(args.linkedinProfileUrl);
    const existing = await getProfileByUserId(ctx, ctx.userId);
    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        linkedinProfileUrl: normalized.linkedinProfileUrl,
        linkedinPublicIdentifier: normalized.linkedinPublicIdentifier,
        updatedAt: now,
      });

      const profile = await ctx.db.get(existing._id);
      return toProfileRecord(profile);
    }

    const profileId = await ctx.db.insert("profiles", {
      userId: ctx.userId,
      linkedinProfileUrl: normalized.linkedinProfileUrl,
      linkedinPublicIdentifier: normalized.linkedinPublicIdentifier,
      updatedAt: now,
    });

    const profile = await ctx.db.get(profileId);
    return toProfileRecord(profile);
  },
});
