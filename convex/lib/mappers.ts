import { Doc } from "../_generated/dataModel";

export function toPostRecord(post: Doc<"posts">) {
  return {
    id: post._id,
    userId: post.userId,
    title: post.title,
    body: post.body,
    publishedDateTime: post.publishedDateTime,
    goal: post.goal,
    category: post.category,
    audience: post.audience,
    linkedinPostId: post.linkedinPostId,
    linkedinUrl: post.linkedinUrl,
    source: post.source ?? "manual",
    importedAt: post.importedAt,
    creationTime: new Date(post._creationTime).toISOString(),
    updatedAt: post.updatedAt,
  };
}

export function toMetricsRecord(metrics: Doc<"metrics"> | null) {
  if (!metrics) {
    return null;
  }

  return {
    id: metrics._id,
    postId: metrics.postId,
    impressions: metrics.impressions,
    reactions: metrics.reactions,
    likes: metrics.likes,
    comments: metrics.comments,
    reposts: metrics.reposts,
    shares: metrics.shares,
    profileVisits: metrics.profileVisits,
    reactionBreakdown: metrics.reactionBreakdown,
    creationTime: new Date(metrics._creationTime).toISOString(),
    updatedAt: metrics.updatedAt,
  };
}

export function toProfileRecord(profile: Doc<"profiles"> | null) {
  if (!profile) {
    return null;
  }

  return {
    id: profile._id,
    userId: profile.userId,
    linkedinProfileUrl: profile.linkedinProfileUrl,
    linkedinPublicIdentifier: profile.linkedinPublicIdentifier,
    linkedinAuthorId: profile.linkedinAuthorId,
    creationTime: new Date(profile._creationTime).toISOString(),
    updatedAt: profile.updatedAt,
  };
}

export function toLinkedInPostSyncRecord(
  sync: Doc<"linkedinPostSyncs"> | null
) {
  if (!sync) {
    return {
      status: "idle" as const,
      startedAt: undefined,
      completedAt: undefined,
      lastSuccessfulSyncAt: undefined,
      errorMessage: undefined,
      fetched: 0,
      imported: 0,
      skippedDuplicate: 0,
      skippedInvalid: 0,
      skippedRepost: 0,
      skippedNonOwned: 0,
      metricsUpdated: 0,
      failed: 0,
    };
  }

  return {
    id: sync._id,
    userId: sync.userId,
    status: sync.status,
    startedAt: sync.startedAt,
    completedAt: sync.completedAt,
    lastSuccessfulSyncAt: sync.lastSuccessfulSyncAt,
    errorMessage: sync.errorMessage,
    fetched: sync.fetched,
    imported: sync.imported,
    skippedDuplicate: sync.skippedDuplicate,
    skippedInvalid: sync.skippedInvalid,
    skippedRepost: sync.skippedRepost,
    skippedNonOwned: sync.skippedNonOwned,
    metricsUpdated: sync.metricsUpdated,
    failed: sync.failed,
  };
}

export function toAnalysisRecord(analysis: Doc<"analyses">, brief?: Doc<"briefs"> | null) {
  return {
    id: analysis._id,
    postId: analysis.postId,
    status: analysis.status,
    snapshot: analysis.snapshot,
    content: analysis.content,
    reasoning: analysis.reasoning,
    confidence: analysis.confidence,
    errorMessage: analysis.errorMessage,
    startedAt: analysis.startedAt,
    completedAt: analysis.completedAt,
    creationTime: new Date(analysis._creationTime).toISOString(),
    updatedAt: analysis.updatedAt,
    stale: analysis.isStale,
    brief: brief ? toBriefRecord(brief) : null,
  };
}

export function toLessonRecord(lesson: Doc<"lessons">) {
  return {
    id: lesson._id,
    postId: lesson.postId,
    analysisId: lesson.analysisId,
    type: lesson.type,
    content: lesson.content,
    creationTime: new Date(lesson._creationTime).toISOString(),
  };
}

export function toPatternRecord(pattern: Doc<"patterns">) {
  return {
    id: pattern._id,
    postId: pattern.postId,
    analysisId: pattern.analysisId,
    sentiment: pattern.sentiment,
    score: pattern.score,
    name: pattern.name,
    description: pattern.description,
    creationTime: new Date(pattern._creationTime).toISOString(),
  };
}

export function toBriefRecord(brief: Doc<"briefs"> | null) {
  if (!brief) {
    return null;
  }

  return {
    id: brief._id,
    postId: brief.postId,
    analysisId: brief.analysisId,
    status: brief.status,
    snapshot: brief.snapshot,
    repeat: brief.repeat,
    avoid: brief.avoid,
    improve: brief.improve,
    nextPostAngle: brief.nextPostAngle,
    nextPostReason: brief.nextPostReason,
    nextPostReminder: brief.nextPostReminder,
    errorMessage: brief.errorMessage,
    startedAt: brief.startedAt,
    completedAt: brief.completedAt,
    creationTime: new Date(brief._creationTime).toISOString(),
    updatedAt: brief.updatedAt,
  };
}

export function toAnalysisSnapshotPost(post: Doc<"posts">) {
  return {
    title: post.title,
    body: post.body,
    publishedDateTime: post.publishedDateTime,
    goal: post.goal,
    category: post.category,
    audience: post.audience,
  };
}

export function toAnalysisSnapshotMetrics(metrics: Doc<"metrics"> | null) {
  return {
    impressions: metrics?.impressions ?? 0,
    reactions: metrics?.reactions ?? 0,
    comments: metrics?.comments ?? 0,
    reposts: metrics?.reposts ?? 0,
    profileVisits: metrics?.profileVisits ?? 0,
  };
}

export function toBriefSnapshot(
  post: Doc<"posts">,
  analysis: Doc<"analyses">,
  lessons: Doc<"lessons">[],
  patterns: Doc<"patterns">[],
) {
  return {
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
  }
}
