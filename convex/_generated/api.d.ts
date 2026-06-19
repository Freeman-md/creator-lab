/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai_analysisPrompt from "../ai/analysisPrompt.js";
import type * as ai_briefPrompt from "../ai/briefPrompt.js";
import type * as ai_formatAnalysisSnapshot from "../ai/formatAnalysisSnapshot.js";
import type * as ai_formatBriefInput from "../ai/formatBriefInput.js";
import type * as ai_schemas from "../ai/schemas.js";
import type * as analyses from "../analyses.js";
import type * as briefs from "../briefs.js";
import type * as internal_analysisJobs from "../internal/analysisJobs.js";
import type * as internal_briefJobs from "../internal/briefJobs.js";
import type * as lessons from "../lessons.js";
import type * as metrics from "../metrics.js";
import type * as patterns from "../patterns.js";
import type * as posts from "../posts.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "ai/analysisPrompt": typeof ai_analysisPrompt;
  "ai/briefPrompt": typeof ai_briefPrompt;
  "ai/formatAnalysisSnapshot": typeof ai_formatAnalysisSnapshot;
  "ai/formatBriefInput": typeof ai_formatBriefInput;
  "ai/schemas": typeof ai_schemas;
  analyses: typeof analyses;
  briefs: typeof briefs;
  "internal/analysisJobs": typeof internal_analysisJobs;
  "internal/briefJobs": typeof internal_briefJobs;
  lessons: typeof lessons;
  metrics: typeof metrics;
  patterns: typeof patterns;
  posts: typeof posts;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
