"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const CALLBACK_URL = "http://127.0.0.1:3000/auth/callback";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: CALLBACK_URL,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setIsSubmitting(false);
      return;
    }

    setMessage("Check your email for the magic link.");
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        name="email"
        placeholder="you@example.com"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="rounded-md border border-zinc-300 px-4 py-3 outline-none"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-black px-4 py-3 text-white disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send magic link"}
      </button>

      {message ? (
        <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </form>
  );
}
