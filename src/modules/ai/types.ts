export type AnalysisSnapshot = {
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

export type BriefInput = {
  sourcePost: {
    id: string;
    title?: string;
    body: string;
    goal: string;
    category: string;
    audience: string;
  };
  analysis: {
    content: string;
    reasoning: string;
    confidence: "low" | "medium" | "high";
  };
  lessons: Array<{
    type: "repeat" | "avoid" | "improve";
    content: string;
  }>;
  patterns: Array<{
    sentiment: "positive" | "negative";
    score: number;
    name: string;
    description: string;
  }>;
};
