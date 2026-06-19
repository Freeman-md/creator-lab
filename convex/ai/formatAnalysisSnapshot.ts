type AnalysisSnapshot = {
  post: {
    id: string;
    title?: string;
    body: string;
    publishedDateTime: string;
    goal: string;
    category: string;
    audience: string;
  };
  metrics: {
    impressions: number;
    reactions: number;
    comments: number;
    reposts: number;
    profileVisits: number;
  };
};

export function formatAnalysisSnapshot(snapshot: AnalysisSnapshot) {
  const titleLine = snapshot.post.title?.trim()
    ? `Title: ${snapshot.post.title.trim()}`
    : "Title: Untitled";

  return [
    "# Post",
    "",
    titleLine,
    "",
    `Published: ${snapshot.post.publishedDateTime}`,
    "",
    `Goal: ${snapshot.post.goal}`,
    "",
    `Category: ${snapshot.post.category}`,
    "",
    `Audience: ${snapshot.post.audience}`,
    "",
    "## Body",
    "",
    snapshot.post.body,
    "",
    "# Metrics",
    "",
    `Impressions: ${snapshot.metrics.impressions}`,
    `Reactions: ${snapshot.metrics.reactions}`,
    `Comments: ${snapshot.metrics.comments}`,
    `Reposts: ${snapshot.metrics.reposts}`,
    `Profile Visits: ${snapshot.metrics.profileVisits}`,
  ].join("\n");
}
