export type MetricsRecord = {
  id: string;
  postId: string;
  impressions: number;
  reactions: number;
  comments: number;
  reposts: number;
  profileVisits: number;
  createdAt: string;
  updatedAt: string;
};

export type MetricsFormValues = Pick<
  MetricsRecord,
  "impressions" | "reactions" | "comments" | "reposts" | "profileVisits"
>;
