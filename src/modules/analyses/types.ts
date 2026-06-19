export type AnalysisStatus = "in_progress" | "completed" | "failed";
export type AnalysisConfidence = "low" | "medium" | "high";

export type AnalysisRecord = {
  id: string;
  postId: string;
  status: AnalysisStatus;
  snapshot: unknown;
  content?: string;
  reasoning?: string;
  confidence?: AnalysisConfidence;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};
