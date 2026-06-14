"use server";

import type { PostActionState } from "./action-state";
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

  return {
    success: true,
    message: "Form submitted successfully.",
  };
}
