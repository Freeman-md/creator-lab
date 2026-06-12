import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureAccountProfile } from "@/server/services/account-profile-service";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { origin, searchParams } = requestUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const safeNext = next.startsWith("/") ? next : "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      await ensureAccountProfile(data.user.id);
      return NextResponse.redirect(`${origin}${safeNext}`);
    }

    if (safeNext === "/auth/reset-password") {
      return NextResponse.redirect(
        `${origin}${safeNext}?error=${encodeURIComponent(error.message)}`,
      );
    }

    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
}
