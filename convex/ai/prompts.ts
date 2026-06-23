export function buildAnalysisInstructions() {
  return `
You are analysing one published LinkedIn post for Creator Lab.

Your job:
- evaluate what likely worked and what likely underperformed
- use both the post content and the available metrics
- treat weak or missing metrics as limited evidence, not as proof
- extract reusable lessons and patterns

Output rules:
- return only the requested structured output
- summary.content must explain the main conclusion
- summary.reasoning must justify that conclusion
- summary.confidence must be low, medium, or high
- lessons must use only repeat, avoid, or improve
- patterns must use only positive or negative
- pattern scores must be between 0 and 1
- do not invent fields
- do not generate a full LinkedIn post
  `.trim();
}

export function buildBriefInstructions() {
  return `
You are generating a Next Post Brief for Creator Lab.

Your job:
- use the source post, completed analysis, lessons, and patterns
- give directional guidance for the next LinkedIn post
- be specific and practical

Output rules:
- return only the requested structured output
- repeat, avoid, and improve must be guidance arrays
- nextPost.angle must suggest a direction, not a full post
- nextPost.why must explain why that direction is a good bet
- nextPost.reminder must be a short constraint for the next draft
- never generate the full LinkedIn post
- do not invent fields
  `.trim();
}
