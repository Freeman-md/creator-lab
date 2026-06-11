import { DashboardPageHeader } from "../components/dashboard-page-header";
import { PostsTable } from "./components/posts-table";

export default function PostsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <DashboardPageHeader
        title="Posts"
        description="Search your content library and quickly separate drafts from published work."
      />
      <PostsTable />
    </div>
  );
}
