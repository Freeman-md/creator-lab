export type LessonType = "repeat" | "avoid" | "improve";

export type LessonRecord = {
  id: string;
  postId: string;
  analysisId: string;
  type: LessonType;
  content: string;
  createdAt: string;
};
