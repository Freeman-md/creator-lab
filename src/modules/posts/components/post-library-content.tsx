import type { FunctionReturnType } from "convex/server";

import { api } from "@convex/_generated/api";
import { EmptyState } from "@/components/ui/empty-state";
import { PostLibraryGrid } from "@/modules/posts/components/post-library-grid";
import { PostLibraryGridSkeleton } from "@/modules/posts/components/post-library-grid-skeleton";

type PostLibraryContentProps = {
  library: FunctionReturnType<typeof api.posts.getAll> | undefined;
};

export function PostLibraryContent({ library }: PostLibraryContentProps) {
  if (library === undefined) {
    return <PostLibraryGridSkeleton />;
  }

  if (library.length === 0) {
    return <EmptyState />;
  }

  return <PostLibraryGrid entries={library} />;
}
