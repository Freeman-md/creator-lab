import { v } from "convex/values";

import { internal } from "./_generated/api";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

function toBriefRecord(brief: Doc<"briefs">) {
  return {
    id: brief._id,
    postId: brief.postId,
    analysisId: brief.analysisId,
    status: brief.status,
    input: brief.input,
    repeat: brief.repeat,
    avoid: brief.avoid,
    improve: brief.improve,
    nextPostAngle: brief.nextPostAngle,
    nextPostReason: brief.nextPostReason,
    nextPostReminder: brief.nextPostReminder,
    errorMessage: brief.errorMessage,
    startedAt: brief.startedAt,
    completedAt: brief.completedAt,
    createdAt: brief.createdAt,
    updatedAt: brief.updatedAt,
  };
}

export const get = query({
  args: {
    briefId: v.optional(v.id("briefs")),
    analysisId: v.optional(v.id("analyses")),
  },
  handler: async (ctx, args) => {
    if (!args.briefId && !args.analysisId) {
      return null;
    }

    const brief =
      args.briefId
        ? await ctx.db.get(args.briefId)
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

export const create = mutation({
  args: {
    analysisId: v.id("analyses"),
  },
  handler: async (ctx, args) => {
    const analysis = await ctx.db.get(args.analysisId);
    if (!analysis) {
      throw new Error("Analysis not found.");
    }
    if (analysis.status !== "completed") {
      throw new Error("Brief generation requires a completed analysis.");
    }

    const post = await ctx.db.get(analysis.postId);
    if (!post) {
      throw new Error("Source post not found.");
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
        id: post._id,
        title: post.title,
        body: post.body,
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

    const now = new Date().toISOString();
    const existing = (
      await ctx.db
        .query("briefs")
        .withIndex("by_analysisId", (q) => q.eq("analysisId", args.analysisId))
        .collect()
    )[0] ?? null;

    let briefId = existing?._id;

    if (existing) {
      if (existing.status === "completed" || existing.status === "in_progress") {
        return toBriefRecord(existing);
      }

      await ctx.db.replace(existing._id, {
        postId: analysis.postId,
        analysisId: args.analysisId,
        status: "in_progress",
        input,
        startedAt: now,
        createdAt: existing.createdAt,
        updatedAt: now,
      });
    } else {
      briefId = await ctx.db.insert("briefs", {
        postId: analysis.postId,
        analysisId: args.analysisId,
        status: "in_progress",
        input,
        startedAt: now,
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.scheduler.runAfter(
      0,
      internal.internal.briefJobs.runBriefGeneration,
      {
      briefId,
      }
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
    if (brief.status !== "in_progress") {
      throw new Error("Only in-progress briefs can be completed.");
    }

    const now = new Date().toISOString();
    await ctx.db.patch(args.briefId, {
      status: "completed",
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

    const now = new Date().toISOString();
    await ctx.db.patch(args.briefId, {
      status: "failed",
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
