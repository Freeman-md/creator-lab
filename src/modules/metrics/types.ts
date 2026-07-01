export type MetricsRecord = {
  id: string;
  postId: string;
  impressions: number;
  reactions: number;
  likes?: number;
  comments: number;
  reposts: number;
  shares?: number;
  profileVisits: number;
  reactionBreakdown?: Record<string, number>;
  creationTime: string;
  updatedAt: number;
};

export type MetricsFormValues = Pick<
  MetricsRecord,
  "impressions" | "reactions" | "comments" | "reposts" | "profileVisits"
>;
