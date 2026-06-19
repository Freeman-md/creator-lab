"use client";

import Link from "next/link";
import { FileTextIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { AppShell } from "@/shared/components/app-shell";

export function PostLibraryView() {
  return (
    <AppShell
      eyebrow="Post Library"
      title="A focused archive for posts worth learning from."
      description="Each saved post should move cleanly from metadata to metrics, analysis, and a practical next-post brief."
      actions={
        <Button asChild>
          <Link href="/posts/new">
            <PlusIcon data-icon="inline-start" />
            New Post
          </Link>
        </Button>
      }
    >
      <Empty className="min-h-[480px] border-border bg-card">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileTextIcon />
          </EmptyMedia>
          <EmptyTitle>No posts saved yet</EmptyTitle>
          <EmptyDescription>
            Start by adding one published LinkedIn post. Creator Lab will carry it through metrics, analysis, and the brief loop from there.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/posts/new">
              <PlusIcon data-icon="inline-start" />
              Create your first post
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </AppShell>
  );
}
