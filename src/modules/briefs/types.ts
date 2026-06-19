export type BriefStatus = "in_progress" | "completed" | "failed";

export type BriefRecord = {
  id: string;
  postId: string;
  analysisId: string;
  status: BriefStatus;
  input: unknown;
  repeat?: string[];
  avoid?: string[];
  improve?: string[];
  nextPostAngle?: string;
  nextPostReason?: string;
  nextPostReminder?: string;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};
