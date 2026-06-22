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
import type * as internal_analyses_actions from "../internal/analyses/actions.js";
import type * as internal_analyses_mutations from "../internal/analyses/mutations.js";
import type * as internal_briefs_actions from "../internal/briefs/actions.js";
import type * as internal_triggers from "../internal/triggers.js";
import type * as lessons from "../lessons.js";
import type * as lib_constants from "../lib/constants.js";
import type * as lib_helpers from "../lib/helpers.js";
import type * as lib_mappers from "../lib/mappers.js";
import type * as lib_utils from "../lib/utils.js";
import type * as metrics from "../metrics.js";
import type * as patterns from "../patterns.js";
import type * as posts from "../posts.js";
import type * as schemas_analyses from "../schemas/analyses.js";
import type * as schemas_briefs from "../schemas/briefs.js";
import type * as schemas_lessons from "../schemas/lessons.js";
import type * as schemas_metrics from "../schemas/metrics.js";
import type * as schemas_patterns from "../schemas/patterns.js";
import type * as schemas_posts from "../schemas/posts.js";
import type * as server from "../server.js";

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
  "internal/analyses/actions": typeof internal_analyses_actions;
  "internal/analyses/mutations": typeof internal_analyses_mutations;
  "internal/briefs/actions": typeof internal_briefs_actions;
  "internal/triggers": typeof internal_triggers;
  lessons: typeof lessons;
  "lib/constants": typeof lib_constants;
  "lib/helpers": typeof lib_helpers;
  "lib/mappers": typeof lib_mappers;
  "lib/utils": typeof lib_utils;
  metrics: typeof metrics;
  patterns: typeof patterns;
  posts: typeof posts;
  "schemas/analyses": typeof schemas_analyses;
  "schemas/briefs": typeof schemas_briefs;
  "schemas/lessons": typeof schemas_lessons;
  "schemas/metrics": typeof schemas_metrics;
  "schemas/patterns": typeof schemas_patterns;
  "schemas/posts": typeof schemas_posts;
  server: typeof server;
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
