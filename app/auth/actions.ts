"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "./schemas";
import type { AuthFeedbackKey } from "./types";

function redirectWith(
  pathname: string,
  key: AuthFeedbackKey,
  value: string,
): never {
  const searchParams = new URLSearchParams({ [key]: value });
  redirect(`${pathname}?${searchParams.toString()}`);
}

function extractFields(formData: FormData) {
  return {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
}

export async function signInWithPassword(formData: FormData) {
  const parsed = signInSchema.safeParse(extractFields(formData));

  if (!parsed.success) {
    redirectWith(
      "/auth/login",
      "error",
      parsed.error.issues[0]?.message ?? "Enter your email and password",
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    redirectWith("/auth/login", "error", error.message);
  }

  redirect("/");
}

export async function signUpWithPassword(formData: FormData) {
  const parsed = signUpSchema.safeParse(extractFields(formData));

  if (!parsed.success) {
    redirectWith(
      "/auth/sign-up",
      "error",
      parsed.error.issues[0]?.message ?? "Enter your email and password",
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(parsed.data);

  if (error) {
    redirectWith("/auth/sign-up", "error", error.message);
  }

  if (data.session) {
    redirect("/");
  }

  redirectWith(
    "/auth/login",
    "message",
    "Account created. Email verification will be added next.",
  );
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
