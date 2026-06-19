import { z } from "zod";

export const analysisSummarySchema = z.object({
  content: z.string().min(1),
  reasoning: z.string().min(1),
  confidence: z.enum(["low", "medium", "high"]),
});

export const analysisLessonSchema = z.object({
  type: z.enum(["repeat", "avoid", "improve"]),
  content: z.string().min(1),
});

export const analysisPatternSchema = z.object({
  sentiment: z.enum(["positive", "negative"]),
  score: z.number().min(0).max(1),
  name: z.string().min(1),
  description: z.string().min(1),
});

export const analysisOutputSchema = z.object({
  summary: analysisSummarySchema,
  lessons: z.array(analysisLessonSchema),
  patterns: z.array(analysisPatternSchema),
});

export const briefOutputSchema = z.object({
  repeat: z.array(z.string().min(1)),
  avoid: z.array(z.string().min(1)),
  improve: z.array(z.string().min(1)),
  nextPost: z.object({
    angle: z.string().min(1),
    why: z.string().min(1),
    reminder: z.string().min(1),
  }),
});

export type AnalysisOutput = z.infer<typeof analysisOutputSchema>;
export type BriefOutput = z.infer<typeof briefOutputSchema>;
