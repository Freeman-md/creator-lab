import { v } from "convex/values";
import { internalQuery } from "../../server";
import { getBriefOrThrow } from "../../lib/reads";

export const getInternal = internalQuery({
  args: {
    briefId: v.id("briefs"),
  },
  handler: async (ctx, args) => {
    const brief = await getBriefOrThrow(ctx, args.briefId)

    return brief
  },
});