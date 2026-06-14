"use client";

import { useActionState } from "react";
import { Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { initialPostActionState } from "../action-state";
import { submitPostForm } from "../actions";
import { postEditorDraft } from "./post-editor-data";
import { ReferenceUrlsField } from "./reference-urls-field";

export function DraftEditorPanel() {
  const [actionState, formAction, isPending] = useActionState(
    submitPostForm,
    initialPostActionState,
  );

  return (
    <section className="flex h-full flex-col overflow-y-auto bg-background">
      <form
        action={formAction}
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-8 lg:px-8 lg:py-10"
      >
        <div className="flex flex-col gap-3">
          <input
            name="title"
            defaultValue={postEditorDraft.title}
            className="w-full border-none bg-transparent p-0 font-heading text-4xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground lg:text-5xl"
            placeholder="Post title"
          />
          <p className="text-sm text-muted-foreground">Optional. AI can generate one.</p>
        </div>

        <FieldGroup className="gap-8">
          <Field data-invalid={Boolean(actionState.fieldErrors?.draftContent)}>
            <FieldLabel className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Draft Content
            </FieldLabel>
            <Textarea
              name="draftContent"
              defaultValue={postEditorDraft.content}
              aria-invalid={Boolean(actionState.fieldErrors?.draftContent)}
              className="min-h-[280px] rounded-xl border-border bg-background text-base leading-7 shadow-none focus-visible:ring-0"
            />
            <FieldError>{actionState.fieldErrors?.draftContent}</FieldError>
          </Field>

          <Field>
            <FieldLabel className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Lightbulb className="size-3.5" />
              Supporting Context
            </FieldLabel>
            <Textarea
              name="supportingContext"
              defaultValue={postEditorDraft.supportingContext}
              className="min-h-28 rounded-xl border-border bg-muted/40"
            />
          </Field>

          <ReferenceUrlsField
            defaultUrls={postEditorDraft.referenceUrls}
            serverError={actionState.fieldErrors?.referenceUrls}
          />
        </FieldGroup>

        <div className="mt-auto space-y-4">
          {actionState.success && actionState.message ? (
            <p className="text-sm text-emerald-600">{actionState.message}</p>
          ) : null}
          <Separator />
          <Button
            type="submit"
            variant="outline"
            className="h-11 w-full justify-center rounded-xl border-border bg-muted/30"
            disabled={isPending}
          >
            <Sparkles data-icon="inline-start" />
            {isPending ? "Submitting..." : "Generate Iteration"}
          </Button>
        </div>
      </form>
    </section>
  );
}
