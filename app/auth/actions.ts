"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "./schemas";
import type { AuthRedirectParams } from "./types";

function redirectWith(pathname: string, params: AuthRedirectParams): never {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const search = searchParams.toString();
  redirect(search ? `${pathname}?${search}` : pathname);
}

function extractFields(formData: FormData) {
  return {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
}

function extractEmail(formData: FormData) {
  return {
    email: String(formData.get("email") ?? ""),
  };
}

async function getRequestOrigin() {
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

async function getEmailVerificationRedirectTo() {
  const origin = await getRequestOrigin();
  return `${origin}/auth/callback?next=/auth/verified`;
}

async function getPasswordResetRedirectTo() {
  const origin = await getRequestOrigin();
  return `${origin}/auth/callback?next=/auth/reset-password`;
}

export async function signInWithPassword(formData: FormData) {
  const parsed = signInSchema.safeParse(extractFields(formData));

  if (!parsed.success) {
    redirectWith(
      "/auth/login",
      {
        error:
          parsed.error.issues[0]?.message ?? "Enter your email and password",
      },
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      redirectWith("/auth/verify-email", {
        email: parsed.data.email,
        message: "Verify your email before signing in.",
      });
    }

    redirectWith("/auth/login", { error: error.message });
  }

  redirect("/");
}

export async function signUpWithPassword(formData: FormData) {
  const parsed = signUpSchema.safeParse(extractFields(formData));

  if (!parsed.success) {
    redirectWith(
      "/auth/sign-up",
      {
        error:
          parsed.error.issues[0]?.message ?? "Enter your email and password",
      },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    options: {
      emailRedirectTo: await getEmailVerificationRedirectTo(),
    },
  });

  if (error) {
    redirectWith("/auth/sign-up", { error: error.message });
  }

  if (data.session) {
    redirect("/");
  }

  redirectWith("/auth/verify-email", {
    email: parsed.data.email,
    message: "Check your email for a verification link.",
  });
}

export async function resendVerificationEmail(formData: FormData) {
  const parsed = resendVerificationSchema.safeParse(extractEmail(formData));

  if (!parsed.success) {
    redirectWith("/auth/verify-email", {
      error: parsed.error.issues[0]?.message ?? "Enter a valid email address.",
    });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: {
      emailRedirectTo: await getEmailVerificationRedirectTo(),
    },
  });

  if (error) {
    redirectWith("/auth/verify-email", {
      email: parsed.data.email,
      error: error.message,
    });
  }

  redirectWith("/auth/verify-email", {
    email: parsed.data.email,
    message: "Verification email sent. Check your inbox.",
  });
}

export async function requestPasswordReset(formData: FormData) {
  const parsed = forgotPasswordSchema.safeParse(extractEmail(formData));

  if (!parsed.success) {
    redirectWith("/auth/forgot-password", {
      error: parsed.error.issues[0]?.message ?? "Enter a valid email address.",
    });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: await getPasswordResetRedirectTo(),
  });

  if (error) {
    redirectWith("/auth/forgot-password", { error: error.message });
  }

  redirectWith("/auth/forgot-password", {
    message: "If an account exists for that email, we sent a reset link.",
  });
}

export async function updatePassword(formData: FormData) {
  const parsed = resetPasswordSchema.safeParse({
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });

  if (!parsed.success) {
    redirectWith("/auth/reset-password", {
      error:
        parsed.error.issues[0]?.message ?? "Enter and confirm your new password.",
    });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    redirectWith("/auth/reset-password", { error: error.message });
  }

  await supabase.auth.signOut();

  redirectWith("/auth/login", {
    message: "Password updated. Sign in with your new password.",
  });
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
