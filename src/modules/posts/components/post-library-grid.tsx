import type { FunctionReturnType } from "convex/server";

import { api } from "@convex/_generated/api";
import { PostLibraryCard } from "@/modules/posts/components/post-library-card";

type PostLibraryGridProps = {
  entries: FunctionReturnType<typeof api.posts.getAll>;
};

export function PostLibraryGrid({ entries }: PostLibraryGridProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {entries.map((entry) => (
        <PostLibraryCard key={entry.post.id} entry={entry} />
      ))}
    </div>
  );
}
