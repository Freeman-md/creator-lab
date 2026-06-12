export const postWorkspaceDraft = {
  title: "The Future of Interface Design",
  status: "Draft" as const,
  content: `As we move into an era of hyper-functional density, interfaces must adapt to become more quiet, serving as a frame rather than the artwork itself.

The core philosophy relies on reductionism: eliminating unnecessary borders, shadows, and cognitive load to prioritize user workflow and content generation.`,
  supportingContext:
    "Target audience: Senior product designers and developers. Tone should be authoritative but accessible. Emphasize 'reductionism'.",
  referenceUrls: ["linear.app/design"],
};

export const postWorkspaceMessages = {
  userPrompt:
    'Can you expand on the draft, focusing on the "reductionism" aspect? Make it sound more technical.',
  assistantIntro:
    "AI Assistant is ready. Provide context or generate an iteration to start.",
  assistantSummary:
    "I've expanded the section on reductionism, incorporating technical terminology regarding cognitive load and spatial relationships in UI components.",
  suggestionVersion: "v1.2",
  suggestionTitle: "Suggested Expansion",
  suggestionBody: `The core philosophy relies on strict reductionism: systematically eliminating superfluous structural elements, non-semantic border delineations, and artificial depth cues.

By enforcing a low-contrast baseline, we drastically reduce the visual noise floor. This approach explicitly prioritizes the user's workflow execution and the semantic value of the content canvas over decorative shell artifacts.`,
  quickActions: ["Make it punchy", "More technical", "More concise"],
};
