import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const APP_URL = "http://127.0.0.1:3000";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const safeNext = next.startsWith("/") ? next : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${APP_URL}${safeNext}`);
    }

    return NextResponse.redirect(
      `${APP_URL}/auth/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(
    `${APP_URL}/auth/login?error=auth_callback_failed`,
  );
}
