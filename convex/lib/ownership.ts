import { Id } from "../_generated/dataModel";
import { AuthMutationCtx, AuthQueryCtx } from "../server";

type AuthenticatedCtx = (AuthQueryCtx | AuthMutationCtx);

export async function getOwnedPostOrThrow(
  ctx: AuthenticatedCtx,
  postId: Id<"posts">
) {
  const post = await ctx.db.get(postId);

  if (!post || post.userId !== ctx.userId) {
    throw new Error("Post not found.");
  }

  return post;
}

export async function getOwnedAnalysisOrThrow(
  ctx: AuthenticatedCtx,
  analysisId: Id<"analyses">
) {
  const analysis = await ctx.db.get(analysisId);

  if (!analysis) {
    throw new Error("Analysis not found.");
  }

  const post = await getOwnedPostOrThrow(ctx, analysis.postId);
  return { analysis, post };
}

export async function getOwnedBriefOrThrow(
  ctx: AuthenticatedCtx,
  briefId: Id<"briefs">
) {
  const brief = await ctx.db.get(briefId);

  if (!brief) {
    throw new Error("Brief not found.");
  }

  const post = await getOwnedPostOrThrow(ctx, brief.postId);
  return { brief, post };
}