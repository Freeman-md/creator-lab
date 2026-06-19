type BriefInput = {
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

function formatLessonGroup(
  heading: string,
  lessons: BriefInput["lessons"],
  type: "repeat" | "avoid" | "improve"
) {
  const filtered = lessons.filter((lesson) => lesson.type === type);
  return [
    `## ${heading}`,
    "",
    ...(filtered.length > 0
      ? filtered.map((lesson) => `- ${lesson.content}`)
      : ["- None recorded"]),
  ].join("\n");
}

function formatPatternGroup(
  heading: string,
  patterns: BriefInput["patterns"],
  sentiment: "positive" | "negative"
) {
  const filtered = patterns.filter((pattern) => pattern.sentiment === sentiment);
  return [
    `## ${heading}`,
    "",
    ...(filtered.length > 0
      ? filtered.flatMap((pattern) => [
          `- ${pattern.name}`,
          `  Score: ${pattern.score}`,
          `  Description: ${pattern.description}`,
        ])
      : ["- None recorded"]),
  ].join("\n");
}

export function formatBriefInput(input: BriefInput) {
  const titleLine = input.sourcePost.title?.trim()
    ? `Title: ${input.sourcePost.title.trim()}`
    : "Title: Untitled";

  return [
    "# Source Post",
    "",
    titleLine,
    "",
    `Goal: ${input.sourcePost.goal}`,
    "",
    `Category: ${input.sourcePost.category}`,
    "",
    `Audience: ${input.sourcePost.audience}`,
    "",
    "## Body",
    "",
    input.sourcePost.body,
    "",
    "# Analysis",
    "",
    `Content: ${input.analysis.content}`,
    "",
    `Reasoning: ${input.analysis.reasoning}`,
    "",
    `Confidence: ${input.analysis.confidence}`,
    "",
    "# Lessons",
    "",
    formatLessonGroup("Repeat", input.lessons, "repeat"),
    "",
    formatLessonGroup("Avoid", input.lessons, "avoid"),
    "",
    formatLessonGroup("Improve", input.lessons, "improve"),
    "",
    "# Patterns",
    "",
    formatPatternGroup("Positive", input.patterns, "positive"),
    "",
    formatPatternGroup("Negative", input.patterns, "negative"),
  ].join("\n");
}
