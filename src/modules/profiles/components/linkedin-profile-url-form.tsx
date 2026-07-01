"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const linkedinProfileUrlSchema = z.object({
  linkedinProfileUrl: z
    .string()
    .trim()
    .url("Enter a valid LinkedIn profile URL.")
    .refine((value) => {
      try {
        const url = new URL(value);
        const host = url.hostname.toLowerCase();
        const [, type, identifier] = url.pathname.split("/");
        return (
          (host === "linkedin.com" || host === "www.linkedin.com") &&
          type === "in" &&
          Boolean(identifier)
        );
      } catch {
        return false;
      }
    }, "Enter a LinkedIn profile URL like https://www.linkedin.com/in/your-name."),
});

export type LinkedInProfileUrlFormValues = z.infer<
  typeof linkedinProfileUrlSchema
>;

type LinkedInProfileUrlFormProps = {
  defaultValue?: string;
  isSaving?: boolean;
  submitLabel: string;
  onSubmit: (values: LinkedInProfileUrlFormValues) => Promise<void> | void;
};

export function LinkedInProfileUrlForm({
  defaultValue,
  isSaving = false,
  submitLabel,
  onSubmit,
}: LinkedInProfileUrlFormProps) {
  const form = useForm<LinkedInProfileUrlFormValues>({
    resolver: zodResolver(linkedinProfileUrlSchema),
    defaultValues: {
      linkedinProfileUrl: defaultValue ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      linkedinProfileUrl: defaultValue ?? "",
    });
  }, [defaultValue, form]);

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit({
          linkedinProfileUrl: values.linkedinProfileUrl.trim(),
        });
      })}
    >
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.linkedinProfileUrl}>
          <FieldLabel htmlFor="linkedin-profile-url">
            LinkedIn profile URL
          </FieldLabel>
          <FieldContent>
            <Input
              id="linkedin-profile-url"
              type="url"
              placeholder="https://www.linkedin.com/in/your-name/"
              aria-invalid={!!form.formState.errors.linkedinProfileUrl}
              {...form.register("linkedinProfileUrl")}
            />
            <FieldDescription>
              Creator Lab uses this profile to import your recent LinkedIn
              posts.
            </FieldDescription>
            <FieldError
              errors={[form.formState.errors.linkedinProfileUrl]}
            />
          </FieldContent>
        </Field>
      </FieldGroup>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Spinner data-icon="inline-start" /> : null}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
