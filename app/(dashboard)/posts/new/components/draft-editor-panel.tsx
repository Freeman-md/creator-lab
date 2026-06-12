import { Link, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { postWorkspaceDraft } from "./post-workspace-data";

export function DraftEditorPanel() {
  return (
    <section className="flex h-full flex-col overflow-y-auto bg-background">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-8 lg:px-8 lg:py-10">
        <div className="space-y-3">
          <input
            defaultValue={postWorkspaceDraft.title}
            className="w-full border-none bg-transparent p-0 font-heading text-4xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground lg:text-5xl"
            placeholder="Post title"
          />
        </div>

        <FieldGroup className="gap-8">
          <Field>
            <FieldLabel className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Draft Content
            </FieldLabel>
            <Textarea
              defaultValue={postWorkspaceDraft.content}
              className="min-h-[280px] rounded-xl border-border bg-background text-base leading-7 shadow-none focus-visible:ring-0"
            />
          </Field>

          <Field>
            <FieldLabel className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Lightbulb className="size-3.5" />
              Supporting Context
            </FieldLabel>
            <Textarea
              defaultValue={postWorkspaceDraft.supportingContext}
              className="min-h-28 rounded-xl border-border bg-muted/40"
            />
          </Field>

          <Field>
            <FieldLabel className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Link className="size-3.5" />
              Reference URLs
            </FieldLabel>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://..."
                className="h-10 rounded-xl border-border bg-background shadow-none"
              />
              <Button
                type="button"
                variant="outline"
                className="h-11 w-10 rounded-xl"
              >
                <span className="text-lg leading-none">+</span>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {postWorkspaceDraft.referenceUrls.map((url) => (
                <span
                  key={url}
                  className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground"
                >
                  {url}
                </span>
              ))}
            </div>
          </Field>
        </FieldGroup>

        <div className="mt-auto space-y-4">
          <Separator />
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full justify-center rounded-xl border-border bg-muted/30"
          >
            <Sparkles data-icon="inline-start" />
            Generate Iteration
          </Button>
        </div>
      </div>
    </section>
  );
}
