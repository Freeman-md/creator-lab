/* eslint-disable no-restricted-imports */
import { customCtx, customMutation } from "convex-helpers/server/customFunctions";
import { Triggers } from "convex-helpers/server/triggers";

import type { DataModel } from "../_generated/dataModel";
import {
  internalMutation as rawInternalMutation,
  mutation as rawMutation,
} from "../_generated/server";
/* eslint-enable no-restricted-imports */
import { didMetricsChange, didPostChange, markLatestCompletedAnalysisStale } from "../lib/stale";

const triggers = new Triggers<DataModel>();

triggers.register("posts", async (ctx, change) => {
  if (change.operation !== "update" || !didPostChange(change.oldDoc, change.newDoc)) {
    return;
  }

  await markLatestCompletedAnalysisStale(ctx, change.newDoc._id);
});

triggers.register("metrics", async (ctx, change) => {
  if (change.operation !== "update" || !didMetricsChange(change.oldDoc, change.newDoc)) {
    return;
  }

  await markLatestCompletedAnalysisStale(ctx, change.newDoc.postId);
});

export const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB));
export const internalMutation = customMutation(
  rawInternalMutation,
  customCtx(triggers.wrapDB)
);
