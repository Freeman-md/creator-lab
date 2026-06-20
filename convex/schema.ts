import { defineSchema } from "convex/server";
import { postsTable } from "./schemas/posts";
import { metricsTable } from "./schemas/metrics";
import { lessonsTable } from "./schemas/lessons";
import { analysesTable } from "./schemas/analyses";
import { patternsTable } from "./schemas/patterns";
import { briefsTable } from "./schemas/briefs";


export default defineSchema({
  posts: postsTable,
  metrics: metricsTable,
  analyses: analysesTable,
  lessons: lessonsTable,
  patterns: patternsTable,
  briefs: briefsTable,
});
