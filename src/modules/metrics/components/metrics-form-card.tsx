"use client";

import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { MetricsFormValues } from "@/modules/metrics/types";

const metricsFormSchema = z.object({
  impressions: z.number().min(0, "Must be 0 or greater."),
  reactions: z.number().min(0, "Must be 0 or greater."),
  comments: z.number().min(0, "Must be 0 or greater."),
  reposts: z.number().min(0, "Must be 0 or greater."),
  profileVisits: z.number().min(0, "Must be 0 or greater."),
});

type MetricsFormCardProps = {
  defaultValues?: Partial<MetricsFormValues>;
  isSaving?: boolean;
  onSubmit: (values: MetricsFormValues) => Promise<void> | void;
};

export function MetricsFormCard({
  defaultValues,
  isSaving = false,
  onSubmit,
}: MetricsFormCardProps) {
  const form = useForm<MetricsFormValues>({
    resolver: zodResolver(metricsFormSchema),
    defaultValues: {
      impressions: defaultValues?.impressions ?? 0,
      reactions: defaultValues?.reactions ?? 0,
      comments: defaultValues?.comments ?? 0,
      reposts: defaultValues?.reposts ?? 0,
      profileVisits: defaultValues?.profileVisits ?? 0,
    },
  });

  useEffect(() => {
    form.reset({
      impressions: defaultValues?.impressions ?? 0,
      reactions: defaultValues?.reactions ?? 0,
      comments: defaultValues?.comments ?? 0,
      reposts: defaultValues?.reposts ?? 0,
      profileVisits: defaultValues?.profileVisits ?? 0,
    });
  }, [defaultValues, form]);

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-semibold tracking-tight">
          Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(async (values: MetricsFormValues) => {
            await onSubmit(values);
          })}
        >
          <FieldGroup>
            {(
              [
                ["impressions", "Impressions"],
                ["reactions", "Reactions"],
                ["comments", "Comments"],
                ["reposts", "Reposts"],
                ["profileVisits", "Profile visits"],
              ] as const
            ).map(([name, label]) => (
              <Field
                key={name}
                data-invalid={!!form.formState.errors[name]}
                orientation="responsive"
              >
                <FieldLabel htmlFor={`metrics-${name}`}>{label}</FieldLabel>
                <FieldContent>
                  <Input
                    id={`metrics-${name}`}
                    type="number"
                    min={0}
                    aria-invalid={!!form.formState.errors[name]}
                    {...form.register(name, { valueAsNumber: true })}
                  />
                  <FieldError errors={[form.formState.errors[name]]} />
                </FieldContent>
              </Field>
            ))}
          </FieldGroup>
          <div className="flex justify-end">
            <Button type="submit" className="w-full sm:w-auto" disabled={isSaving}>
              {isSaving ? <Spinner data-icon="inline-start" /> : null}
              Save metrics
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
