import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Sign in</h1>
        <p className="text-sm text-zinc-600">
          Enter your email and we&apos;ll send you a magic link.
        </p>
      </div>

      {params.message ? (
        <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          {params.message}
        </p>
      ) : null}

      {params.error ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {params.error}
        </p>
      ) : null}

      <LoginForm />

      <Link href="/" className="text-sm text-zinc-600 underline">
        Back home
      </Link>
    </main>
  );
}
