export type PatternSentiment = "positive" | "negative";

export type PatternRecord = {
  id: string;
  postId: string;
  analysisId: string;
  sentiment: PatternSentiment;
  score: number;
  name: string;
  description: string;
  createdAt: string;
};
