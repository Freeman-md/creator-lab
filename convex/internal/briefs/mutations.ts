import { v } from "convex/values";
import { BRIEF_STATUS } from "../../lib/constants";
import { toBriefRecord } from "../../lib/mappers";
import { getBriefOrThrow } from "../../lib/reads";
import { internalMutation } from "../triggers";

export const complete = internalMutation({
  args: {
    briefId: v.id("briefs"),
    output: v.object({
      repeat: v.array(v.string()),
      avoid: v.array(v.string()),
      improve: v.array(v.string()),
      nextPost: v.object({
        angle: v.string(),
        why: v.string(),
        reminder: v.string(),
      }),
    }),
  },
  handler: async (ctx, args) => {
    const brief = await getBriefOrThrow(ctx, args.briefId)

    if (brief.status !== BRIEF_STATUS.IN_PROGRESS) {
      throw new Error("Only in-progress briefs can be completed.");
    }

    const now = Date.now();
    await ctx.db.patch(args.briefId, {
      status: BRIEF_STATUS.COMPLETED,
      repeat: args.output.repeat,
      avoid: args.output.avoid,
      improve: args.output.improve,
      nextPostAngle: args.output.nextPost.angle,
      nextPostReason: args.output.nextPost.why,
      nextPostReminder: args.output.nextPost.reminder,
      completedAt: now,
      updatedAt: now,
    });

    const completedBrief = await getBriefOrThrow(ctx, brief._id, "Brief completion failed")

    return toBriefRecord(completedBrief);
  },
});

export const fail = internalMutation({
  args: {
    briefId: v.id("briefs"),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const brief = await getBriefOrThrow(ctx, args.briefId)

    const now = Date.now();
    await ctx.db.patch(args.briefId, {
      status: BRIEF_STATUS.FAILED,
      errorMessage: args.errorMessage,
      completedAt: now,
      updatedAt: now,
    });

    const failedBrief = await getBriefOrThrow(ctx, brief._id, "Brief failure state was not saved.")


    return toBriefRecord(failedBrief);
  },
});
