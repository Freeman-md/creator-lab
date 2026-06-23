import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { ANALYSIS_STATUS } from "./constants";

export async function ensureNoActiveAnalysis(
  ctx: QueryCtx | MutationCtx,
  postId: Id<"posts">
) {
  const analysis = await ctx.db
    .query("analyses")
    .withIndex("by_postId_and_status", (q) =>
      q.eq("postId", postId).eq("status", ANALYSIS_STATUS.IN_PROGRESS)
    )
    .unique()

  if (analysis) {
    throw new Error("An analysis is already in progress for this post.");
  }
}