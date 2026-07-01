"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@convex/_generated/api";
import { AppShell } from "@/components/ui/app-shell";
import { Button } from "@/components/ui/button";
import { PostEditorForm } from "@/modules/posts/components/post-editor-form";
import { PostFormSubmitValues } from "@/modules/posts/types";

export default function NewPostPage() {
  const router = useRouter();
  const createPost = useMutation(api.posts.create);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async (values: PostFormSubmitValues) => {
    setIsSaving(true);

    try {
      const created = await createPost(values);

      toast.success("Post created.");
      
      router.push(`/dashboard/posts/${created.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Post creation failed."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell
      eyebrow="Create Post"
      title="Capture the source post before anything else."
      description="The post record is the anchor for every later step: metrics, analysis, lessons, patterns, and the next-post brief."
      actions={
        <Button asChild variant="outline">
          <Link href="/dashboard/posts">
            <ArrowLeftIcon data-icon="inline-start" />
            Back to library
          </Link>
        </Button>
      }
    >
      <PostEditorForm
        title="New post draft"
        submitLabel="Create post"
        isSaving={isSaving}
        onSubmit={handleCreate}
      />
    </AppShell>
  );
}
