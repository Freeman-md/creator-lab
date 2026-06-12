import { DashboardPageHeader } from "../components/dashboard-page-header";
import { PostsTable } from "./components/posts-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PostsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <DashboardPageHeader
        title="Posts"
        description="Search your content library and quickly separate drafts from published work."
        actions={
          <Button asChild className="rounded-md">
            <Link href="/posts/new">New Post</Link>
          </Button>
        }
      />
      <PostsTable />
    </div>
  );
}
