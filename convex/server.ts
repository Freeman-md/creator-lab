import { ConvexError } from "convex/values";
import {
  customAction,
  CustomCtx,
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";

import {
  action,
  httpAction,
  internalAction,
  internalQuery,
  query,
} from "./_generated/server";
import { internalMutation, mutation } from "./internal/triggers";

const authCtx = customCtx(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Unauthorized.");
  }

  return { userId: identity.subject };
});

export { action, httpAction, internalAction, internalMutation, internalQuery, mutation, query };

export const authQuery = customQuery(query, authCtx);
export const authMutation = customMutation(mutation, authCtx);
export const authAction = customAction(action, authCtx);

export type AuthQueryCtx = CustomCtx<typeof authQuery>;
export type AuthMutationCtx = CustomCtx<typeof authMutation>;
export type AuthActionCtx = CustomCtx<typeof authAction>;
