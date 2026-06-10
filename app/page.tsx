import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./auth/actions";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold">Creator Lab</h1>
        <p className="text-zinc-600">Supabase auth is wired into this app.</p>
      </div>

      {user ? (
        <div className="space-y-4 rounded-lg border border-zinc-200 p-6">
          <p className="text-sm text-zinc-600">Signed in as</p>
          <p className="font-medium">{user.email}</p>

          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-3 text-white"
            >
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-4 rounded-lg border border-zinc-200 p-6">
          <p>You are not signed in.</p>
          <Link
            href="/auth/login"
            className="inline-block rounded-md bg-black px-4 py-3 text-white"
          >
            Go to login
          </Link>
        </div>
      )}
    </main>
  );
}