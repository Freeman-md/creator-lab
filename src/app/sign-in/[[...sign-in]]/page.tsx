import { GoogleAuthPanel } from "@/components/auth/google-auth-panel";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { normalizeRedirectTarget } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type SignInPageProps = {
  searchParams: Promise<{
    redirect_url?: string | string[];
  }>;
};

export default async function Page({ searchParams }: SignInPageProps) {
  const session = await auth();
  if (session.userId) {
    redirect("/posts");
  }

  const query = await searchParams;
  const redirectUrlComplete = normalizeRedirectTarget(query.redirect_url);

  return (
    <AuthPageShell
      title="Sign in to Creator Lab"
      description="Use Google to open your Creator Lab workspace."
    >
      <GoogleAuthPanel redirectUrlComplete={redirectUrlComplete} />
    </AuthPageShell>
  );
}
