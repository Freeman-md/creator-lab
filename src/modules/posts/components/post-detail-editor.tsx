"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import type { Id } from "@convex/_generated/dataModel";
import { toast } from "sonner";

import { api } from "@convex/_generated/api";
import { PostEditorForm } from "@/modules/posts/components/post-editor-form";
import type { PostRecord, PostFormSubmitValues } from "@/modules/posts/types";

type PostDetailEditorProps = {
  postId: Id<"posts">;
  defaultValues: PostRecord;
};

export function PostDetailEditor({
  postId,
  defaultValues,
}: PostDetailEditorProps) {
  const updatePost = useMutation(api.posts.update);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (values: PostFormSubmitValues) => {
    setIsSaving(true);

    try {
      await updatePost({
        postId,
        ...values,
      });
      toast.success("Post updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Post update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PostEditorForm
      title="Post content"
      submitLabel="Save post"
      isSaving={isSaving}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
    />
  );
}
