import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthRedirectParams } from "./types";

export function redirectWith(
  pathname: string,
  params: AuthRedirectParams,
): never {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const search = searchParams.toString();
  redirect(search ? `${pathname}?${search}` : pathname);
}

export function extractCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
}

export function extractEmail(formData: FormData) {
  return {
    email: String(formData.get("email") ?? ""),
  };
}

export function extractPasswordReset(formData: FormData) {
  return {
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };
}

export async function getRequestOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return origin;
  }

  const host =
    headerStore.get("x-forwarded-host") ??
    headerStore.get("host") ??
    "localhost:3000";
  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");

  return `${protocol}://${host}`;
}

export async function getAuthCallbackUrl() {
  const origin = await getRequestOrigin();
  return `${origin}/auth/callback`;
}

export async function getEmailVerificationRedirectTo() {
  const callbackUrl = await getAuthCallbackUrl();
  return `${callbackUrl}?next=/auth/verified`;
}

export async function getPasswordResetRedirectTo() {
  const callbackUrl = await getAuthCallbackUrl();
  return `${callbackUrl}?next=/auth/reset-password`;
}
