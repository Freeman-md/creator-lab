"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { useQuery } from "convex/react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/ui/app-shell";
import { api } from "@convex/_generated/api";
import { LinkedInPostSyncControl } from "@/modules/posts/components/linkedin-post-sync-control";
import { PostLibraryContent } from "@/modules/posts/components/post-library-content";

export default function PostsPage() {
  const library = useQuery(api.posts.getAll, {});
  const syncStatus = useQuery(api.linkedinPosts.getSyncStatus, {});

  return (
    <AppShell
      eyebrow="Post Library"
      title="A focused archive for posts worth learning from."
      description="Each saved post should move cleanly from metadata to metrics, analysis, and a practical next-post brief."
      actions={
        <>
          <LinkedInPostSyncControl syncStatus={syncStatus} />
          <Button asChild>
            <Link href="/dashboard/posts/new">
              <PlusIcon data-icon="inline-start" />
              New Post
            </Link>
          </Button>
        </>
      }
    >
      <PostLibraryContent library={library} />
    </AppShell>
  );
}
