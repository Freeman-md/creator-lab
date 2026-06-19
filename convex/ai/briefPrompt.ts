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
