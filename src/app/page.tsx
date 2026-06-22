import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const hasClerkKeys = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

export default async function HomePage() {
  if (!hasClerkKeys) {
    redirect("/sign-in");
  }

  const session = await auth();
  redirect(session.userId ? "/posts" : "/sign-in");
}
