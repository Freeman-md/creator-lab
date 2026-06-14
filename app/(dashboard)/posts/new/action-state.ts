export type PostActionState = {
  success: boolean;
  message?: string;
  fieldErrors?: {
    title?: string;
    draftContent?: string;
    supportingContext?: string;
    referenceUrls?: string;
  };
};

export const initialPostActionState: PostActionState = {
  success: false,
};
