"use client";

import { useState } from "react";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { referenceUrlSchema } from "../schemas";

type ReferenceUrlsFieldProps = {
  defaultUrls: string[];
  serverError?: string;
};

type ReferenceUrlsFieldErrors = {
  referenceUrlInput?: string;
};

export function ReferenceUrlsField({
  defaultUrls,
  serverError,
}: ReferenceUrlsFieldProps) {
  const [referenceUrlInput, setReferenceUrlInput] = useState("");
  const [referenceUrls, setReferenceUrls] = useState(defaultUrls);
  const [errors, setErrors] = useState<ReferenceUrlsFieldErrors>({});

  const addReferenceUrl = () => {
    const normalizedReferenceUrlInput = referenceUrlInput.trim();

    if (!normalizedReferenceUrlInput) {
      setErrors({});
      return;
    }

    const parsed = referenceUrlSchema.safeParse(normalizedReferenceUrlInput);

    if (!parsed.success) {
      setErrors({
        referenceUrlInput: parsed.error.issues[0]?.message,
      });

      return;
    }

    if (referenceUrls.includes(parsed.data)) {
      setErrors({
        referenceUrlInput: "URL already added.",
      });

      return;
    }

    setReferenceUrls((current) => [...current, parsed.data]);
    setReferenceUrlInput("");
    setErrors({});
  };

  const removeReferenceUrl = (value: string) => {
    setReferenceUrls((current) => current.filter((url) => url !== value));
  };

  return (
    <Field data-invalid={Boolean(errors.referenceUrlInput || serverError)}>
      <FieldLabel className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <Link className="size-3.5" />
        Reference URLs
      </FieldLabel>
      <div className="flex gap-2">
        <Input
          type="url"
          value={referenceUrlInput}
          onChange={(event) => setReferenceUrlInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addReferenceUrl();
            }
          }}
          aria-invalid={Boolean(errors.referenceUrlInput || serverError)}
          placeholder="https://..."
          className="h-10 rounded-xl border-border bg-background shadow-none"
        />
        <Button
          type="button"
          variant="outline"
          className="h-11 w-10 rounded-xl"
          onClick={addReferenceUrl}
        >
          <span className="text-lg leading-none">+</span>
        </Button>
      </div>
      <FieldDescription>Add one URL at a time. Valid URLs only.</FieldDescription>
      <FieldError>{errors.referenceUrlInput}</FieldError>
      <FieldError>{serverError}</FieldError>
      <div className="flex flex-wrap gap-2">
        {referenceUrls.map((url) => (
          <div
            key={url}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground"
          >
            <input type="hidden" name="referenceUrls" value={url} />
            {url}
            <button
              type="button"
              onClick={() => removeReferenceUrl(url)}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label={`Remove ${url}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </Field>
  );
}
