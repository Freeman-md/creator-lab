import { defineSchema } from "convex/server";
import { postsTable } from "./schemas/posts";
import { metricsTable } from "./schemas/metrics";
import { lessonsTable } from "./schemas/lessons";
import { analysesTable } from "./schemas/analyses";
import { patternsTable } from "./schemas/patterns";
import { briefsTable } from "./schemas/briefs";
import { profilesTable } from "./schemas/profiles";
import { linkedinPostSyncsTable } from "./schemas/linkedinPostSyncs";


export default defineSchema({
  profiles: profilesTable,
  posts: postsTable,
  metrics: metricsTable,
  linkedinPostSyncs: linkedinPostSyncsTable,
  analyses: analysesTable,
  lessons: lessonsTable,
  patterns: patternsTable,
  briefs: briefsTable,
});
