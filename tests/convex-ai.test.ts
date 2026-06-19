import { describe, expect, test } from "vitest";

import { formatAnalysisSnapshot } from "@convex/ai/formatAnalysisSnapshot";
import { formatBriefInput } from "@convex/ai/formatBriefInput";
import {
  analysisOutputSchema,
  briefOutputSchema,
} from "@convex/ai/schemas";

describe("convex ai contracts", () => {
  test("formats the analysis snapshot as markdown", () => {
    const output = formatAnalysisSnapshot({
      post: {
        id: "post_123",
        title: "Building before clarity",
        body: "Full LinkedIn post text here...",
        publishedDateTime: "2026-06-19T08:30:00Z",
        goal: "Show my product thinking process",
        category: "Building in public",
        audience: "Founders and builders",
      },
      metrics: {
        impressions: 1200,
        reactions: 42,
        comments: 8,
        reposts: 2,
        profileVisits: 15,
      },
    });

    expect(output).toContain("# Post");
    expect(output).toContain("Title: Building before clarity");
    expect(output).toContain("Published: 2026-06-19T08:30:00Z");
    expect(output).toContain("Profile Visits: 15");
  });

  test("formats the brief input as markdown", () => {
    const output = formatBriefInput({
      sourcePost: {
        id: "post_123",
        title: "Building before clarity",
        body: "Full LinkedIn post text here...",
        goal: "Show my product thinking process",
        category: "Building in public",
        audience: "Founders and builders",
      },
      analysis: {
        content: "The post worked because it had clear tension.",
        reasoning: "The builder story was useful and focused.",
        confidence: "medium",
      },
      lessons: [
        { type: "repeat", content: "Open with tension." },
        { type: "avoid", content: "Do not split attention." },
        { type: "improve", content: "Tighten the takeaway." },
      ],
      patterns: [
        {
          sentiment: "positive",
          score: 0.9,
          name: "Builder tension",
          description: "Turns friction into a lesson.",
        },
      ],
    });

    expect(output).toContain("# Source Post");
    expect(output).toContain("## Repeat");
    expect(output).toContain("## Positive");
    expect(output).toContain("Score: 0.9");
  });

  test("accepts valid analysis structured output", () => {
    expect(() =>
      analysisOutputSchema.parse({
        summary: {
          content: "The post worked.",
          reasoning: "It was focused and practical.",
          confidence: "medium",
        },
        lessons: [{ type: "repeat", content: "Lead with tension." }],
        patterns: [
          {
            sentiment: "positive",
            score: 0.82,
            name: "Specific obstacle",
            description: "A concrete obstacle made the lesson relatable.",
          },
        ],
      })
    ).not.toThrow();
  });

  test("rejects invalid analysis structured output", () => {
    expect(() =>
      analysisOutputSchema.parse({
        summary: {
          content: "The post worked.",
          reasoning: "It was focused and practical.",
          confidence: "medium",
        },
        lessons: [{ type: "repeat", content: "Lead with tension." }],
        patterns: [
          {
            sentiment: "positive",
            score: 1.5,
            name: "Specific obstacle",
            description: "A concrete obstacle made the lesson relatable.",
          },
        ],
      })
    ).toThrow();
  });

  test("accepts valid brief structured output", () => {
    expect(() =>
      briefOutputSchema.parse({
        repeat: ["Open with a real tension."],
        avoid: ["Do not scatter the story."],
        improve: ["Sharpen the final lesson."],
        nextPost: {
          angle: "Write about defining the system before building.",
          why: "It extends the strongest prior pattern.",
          reminder: "One tension, one lesson, one takeaway.",
        },
      })
    ).not.toThrow();
  });

  test("rejects invalid brief structured output", () => {
    expect(() =>
      briefOutputSchema.parse({
        repeat: ["Open with a real tension."],
        avoid: ["Do not scatter the story."],
        improve: ["Sharpen the final lesson."],
        nextPost: {
          angle: "Write about defining the system before building.",
          why: "It extends the strongest prior pattern.",
        },
      })
    ).toThrow();
  });
});
