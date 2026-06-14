import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostPerformanceForm } from "./components/post-performance-form";
import { PostPerformancePreview } from "./components/post-performance-preview";

export default function PostPerformancePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Published
        </Link>

        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Record Performance
          </h1>
          <p className="text-sm text-muted-foreground">
            Update metrics for your recent post to track engagement trends.
          </p>
        </div>
      </div>

      <PostPerformancePreview />
      <PostPerformanceForm />
    </div>
  );
}
