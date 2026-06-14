import { z } from "zod";

export const referenceUrlSchema = z
  .string()
  .trim()
  .min(1, "Enter a valid URL.")
  .url("Enter a valid URL.");

const optionalTrimmedString = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined));

export const postSchema = z.object({
  title: optionalTrimmedString.optional(),
  draftContent: z
    .string()
    .trim()
    .min(1, "Draft content is required."),
  supportingContext: optionalTrimmedString.optional(),
  referenceUrls: z.array(referenceUrlSchema).optional().default([]),
});

export type PostFormValues = z.infer<typeof postSchema>;
