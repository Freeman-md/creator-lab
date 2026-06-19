"use client";

import { useEffect } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { PostFormSubmitValues } from "@/modules/posts/types";

const postFormSchema = z.object({
  title: z.string(),
  body: z.string().trim().min(1, "Post body is required."),
  publishedDateTime: z.string().min(1, "Publish date and time are required."),
  goal: z.string().trim().min(1, "Goal is required."),
  category: z.string().trim().min(1, "Category is required."),
  audience: z.string().trim().min(1, "Audience is required."),
});
type PostEditorFormValues = z.infer<typeof postFormSchema>;

type PostEditorFormProps = {
  defaultValues?: Partial<PostEditorFormValues>;
  isSaving?: boolean;
  title: string;
  submitLabel: string;
  onSubmit: (values: PostFormSubmitValues) => Promise<void> | void;
};

function toDatetimeLocalValue(value?: string) {
  if (!value) {
    return "";
  }

  return format(new Date(value), "yyyy-MM-dd'T'HH:mm");
}

export function PostEditorForm({
  defaultValues,
  isSaving = false,
  title,
  submitLabel,
  onSubmit,
}: PostEditorFormProps) {
  const form = useForm<PostEditorFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      body: defaultValues?.body ?? "",
      publishedDateTime: toDatetimeLocalValue(defaultValues?.publishedDateTime),
      goal: defaultValues?.goal ?? "",
      category: defaultValues?.category ?? "",
      audience: defaultValues?.audience ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      title: defaultValues?.title ?? "",
      body: defaultValues?.body ?? "",
      publishedDateTime: toDatetimeLocalValue(defaultValues?.publishedDateTime),
      goal: defaultValues?.goal ?? "",
      category: defaultValues?.category ?? "",
      audience: defaultValues?.audience ?? "",
    });
  }, [defaultValues, form]);

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-xl font-semibold tracking-tight">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit({
              title: values.title?.trim() ? values.title.trim() : undefined,
              body: values.body.trim(),
              publishedDateTime: new Date(values.publishedDateTime).toISOString(),
              goal: values.goal.trim(),
              category: values.category.trim(),
              audience: values.audience.trim(),
            });
          })}
        >
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.title}>
              <FieldLabel htmlFor="post-title">Title</FieldLabel>
              <FieldContent>
                <Input
                  id="post-title"
                  placeholder="Optional post label"
                  {...form.register("title")}
                />
                <FieldError errors={[form.formState.errors.title]} />
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.publishedDateTime}>
              <FieldLabel htmlFor="post-publishedDateTime">
                Published date and time
              </FieldLabel>
              <FieldContent>
                <Input
                  id="post-publishedDateTime"
                  type="datetime-local"
                  aria-invalid={!!form.formState.errors.publishedDateTime}
                  {...form.register("publishedDateTime")}
                />
                <FieldError errors={[form.formState.errors.publishedDateTime]} />
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.goal}>
              <FieldLabel htmlFor="post-goal">Goal</FieldLabel>
              <FieldContent>
                <Input
                  id="post-goal"
                  placeholder="What was this post trying to achieve?"
                  aria-invalid={!!form.formState.errors.goal}
                  {...form.register("goal")}
                />
                <FieldError errors={[form.formState.errors.goal]} />
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.category}>
              <FieldLabel htmlFor="post-category">Category</FieldLabel>
              <FieldContent>
                <Input
                  id="post-category"
                  placeholder="Building in public, product, engineering..."
                  aria-invalid={!!form.formState.errors.category}
                  {...form.register("category")}
                />
                <FieldError errors={[form.formState.errors.category]} />
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.audience}>
              <FieldLabel htmlFor="post-audience">Audience</FieldLabel>
              <FieldContent>
                <Input
                  id="post-audience"
                  placeholder="Who was the post for?"
                  aria-invalid={!!form.formState.errors.audience}
                  {...form.register("audience")}
                />
                <FieldError errors={[form.formState.errors.audience]} />
              </FieldContent>
            </Field>
            <Field data-invalid={!!form.formState.errors.body}>
              <FieldLabel htmlFor="post-body">Post body</FieldLabel>
              <FieldContent>
                <Textarea
                  id="post-body"
                  className="min-h-64"
                  placeholder="Paste the published LinkedIn post text here."
                  aria-invalid={!!form.formState.errors.body}
                  {...form.register("body")}
                />
                <FieldDescription>
                  The full post body becomes part of the immutable analysis
                  snapshot.
                </FieldDescription>
                <FieldError errors={[form.formState.errors.body]} />
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
      </CardContent>
    </Card>
  );
}
