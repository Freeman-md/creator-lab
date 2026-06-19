"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppShell } from "@/shared/components/app-shell";

export function CreatePostView() {
  return (
    <AppShell
      eyebrow="Create Post"
      title="Capture the source post before anything else."
      description="The post record is the anchor for every later step: metrics, analysis, lessons, patterns, and the next-post brief."
      actions={
        <Button asChild variant="outline">
          <Link href="/posts">
            <ArrowLeftIcon data-icon="inline-start" />
            Back to library
          </Link>
        </Button>
      }
    >
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-xl font-semibold tracking-tight">
            New post draft
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="post-title">Title</FieldLabel>
              <FieldContent>
                <Input id="post-title" placeholder="Optional post label" />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="post-body">Post body</FieldLabel>
              <FieldContent>
                <Textarea
                  id="post-body"
                  className="min-h-64"
                  placeholder="Paste the published LinkedIn post text here."
                />
                <FieldDescription>
                  The full post body becomes part of the immutable analysis snapshot.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </AppShell>
  );
}
