import { v } from "convex/values";

import { internal } from "./_generated/api";
import { authMutation, authQuery, internalQuery, mutation } from "./server";
import { ANALYSIS_STATUS, BRIEF_STATUS } from "./lib/constants";
import { toBriefRecord } from "./lib/mappers";
import { getOwnedAnalysis, getOwnedBrief } from "./lib/helpers";

export const get = authQuery({
  args: {
    briefId: v.optional(v.id("briefs")),
    analysisId: v.optional(v.id("analyses")),
  },
  handler: async (ctx, args) => {
    if (!args.briefId && !args.analysisId) {
      return null;
    }

    if (args.analysisId) {
      await getOwnedAnalysis(ctx, args.analysisId);
    }

    const brief = args.briefId
      ? (await getOwnedBrief(ctx, args.briefId)).brief
      : (
          await ctx.db
            .query("briefs")
            .withIndex("by_analysisId", (q) =>
              q.eq("analysisId", args.analysisId!)
            )
            .collect()
        )[0] ?? null;

    return brief ? toBriefRecord(brief) : null;
  },
});

export const getInternal = internalQuery({
  args: {
    briefId: v.id("briefs"),
  },
  handler: async (ctx, args) => {
    const brief = await ctx.db.get(args.briefId);
    if (!brief) {
      throw new Error("Brief not found.");
    }

    const analysis = await ctx.db.get(brief.analysisId);
    if (!analysis) {
      throw new Error("Analysis not found.");
    }

    const post = await ctx.db.get(brief.postId);
    if (!post) {
      throw new Error("Post not found.");
    }

    return {
      brief: toBriefRecord(brief),
      analysisId: analysis._id,
      postId: post._id,
    };
  },
});

export const create = authMutation({
  args: {
    analysisId: v.id("analyses"),
  },
  handler: async (ctx, args) => {
    const { analysis, post } = await getOwnedAnalysis(ctx, args.analysisId);
    if (analysis.status !== ANALYSIS_STATUS.COMPLETED) {
      throw new Error("Brief generation requires a completed analysis.");
    }

    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_analysisId", (q) => q.eq("analysisId", args.analysisId))
      .collect();
    const patterns = await ctx.db
      .query("patterns")
      .withIndex("by_analysisId", (q) => q.eq("analysisId", args.analysisId))
      .collect();

    if (lessons.length === 0 && patterns.length === 0) {
      throw new Error(
        "Brief generation requires lessons or patterns from the completed analysis."
      );
    }

    const input = {
      sourcePost: {
        title: post.title,
        body: post.body,
        publishedDateTime: post.publishedDateTime,
        goal: post.goal,
        category: post.category,
        audience: post.audience,
      },
      analysis: {
        content: analysis.content ?? "",
        reasoning: analysis.reasoning ?? "",
        confidence: analysis.confidence ?? "low",
      },
      lessons: lessons.map((lesson) => ({
        type: lesson.type,
        content: lesson.content,
      })),
      patterns: patterns.map((pattern) => ({
        sentiment: pattern.sentiment,
        score: pattern.score,
        name: pattern.name,
        description: pattern.description,
      })),
    };

    const now = Date.now();
    const existing = (
      await ctx.db
        .query("briefs")
        .withIndex("by_analysisId", (q) => q.eq("analysisId", args.analysisId))
        .collect()
    )[0] ?? null;

    let briefId = existing?._id;

    if (existing) {
      if (
        existing.status === BRIEF_STATUS.COMPLETED ||
        existing.status === BRIEF_STATUS.IN_PROGRESS
      ) {
        return toBriefRecord(existing);
      }

      await ctx.db.replace(existing._id, {
        postId: analysis.postId,
        analysisId: args.analysisId,
        status: BRIEF_STATUS.IN_PROGRESS,
        input,
        startedAt: now,
        updatedAt: now,
      });
    } else {
      briefId = await ctx.db.insert("briefs", {
        postId: analysis.postId,
        analysisId: args.analysisId,
        status: BRIEF_STATUS.IN_PROGRESS,
        input,
        startedAt: now,
        updatedAt: now,
      });
    }

    await ctx.scheduler.runAfter(
      0,
      internal.internal.briefs.actions.runBriefGeneration,
      { briefId }
    );

    const brief = await ctx.db.get(briefId);
    if (!brief) {
      throw new Error("Brief creation failed.");
    }

    return toBriefRecord(brief);
  },
});

export const complete = mutation({
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
    const brief = await ctx.db.get(args.briefId);
    if (!brief) {
      throw new Error("Brief not found.");
    }
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

    const completed = await ctx.db.get(args.briefId);
    if (!completed) {
      throw new Error("Brief completion failed.");
    }

    return toBriefRecord(completed);
  },
});

export const fail = mutation({
  args: {
    briefId: v.id("briefs"),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const brief = await ctx.db.get(args.briefId);
    if (!brief) {
      throw new Error("Brief not found.");
    }

    const now = Date.now();
    await ctx.db.patch(args.briefId, {
      status: BRIEF_STATUS.FAILED,
      errorMessage: args.errorMessage,
      completedAt: now,
      updatedAt: now,
    });

    const failed = await ctx.db.get(args.briefId);
    if (!failed) {
      throw new Error("Brief failure state was not saved.");
    }

    return toBriefRecord(failed);
  },
});
