"use server";

import type { PostActionState } from "./action-state";
import { createClient } from "@/lib/supabase/server";
import { createDraftPostForUser } from "@/server/services/post-service";
import { postSchema } from "./schemas";

export async function submitPostForm(
  _previousState: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    draftContent: formData.get("draftContent"),
    supportingContext: formData.get("supportingContext"),
    referenceUrls: formData.getAll("referenceUrls"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    return {
      success: false,
      fieldErrors: {
        title: fieldErrors.title?.[0],
        draftContent: fieldErrors.draftContent?.[0],
        supportingContext: fieldErrors.supportingContext?.[0],
        referenceUrls: fieldErrors.referenceUrls?.[0],
      },
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      formError: "You must be signed in to create a draft post.",
    };
  }

  try {
    const { postId } = await createDraftPostForUser({
      userId: user.id,
      title: parsed.data.title,
      draftContent: parsed.data.draftContent,
      supportingContext: parsed.data.supportingContext,
      referenceUrls: parsed.data.referenceUrls,
    });

    return {
      success: true,
      message: "Draft post created successfully.",
      postId,
    };
  } catch (error) {
    console.error(error)
    
    return {
      success: false,
      formError: "Unable to create draft post right now. Please try again.",
    };
  }

}
