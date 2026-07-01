"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import { api } from "@convex/_generated/api";
import { AppShell } from "@/components/ui/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LinkedInProfileUrlForm,
  LinkedInProfileUrlFormValues,
} from "@/modules/profiles/components/linkedin-profile-url-form";

export default function SettingsPage() {
  const profile = useQuery(api.profiles.getCurrent, {});
  const upsertProfile = useMutation(api.profiles.upsertLinkedInProfile);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(values: LinkedInProfileUrlFormValues) {
    setIsSaving(true);

    try {
      await upsertProfile(values);
      toast.success("LinkedIn profile saved.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "LinkedIn profile could not be saved."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppShell
      eyebrow="Settings"
      title="Workspace settings"
      description="Manage the LinkedIn profile Creator Lab uses for post imports."
    >
      <Card className="max-w-2xl border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-xl font-semibold tracking-tight">
            LinkedIn profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile === undefined ? (
            <div className="space-y-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          ) : (
            <LinkedInProfileUrlForm
              defaultValue={profile?.linkedinProfileUrl}
              submitLabel="Save profile"
              isSaving={isSaving}
              onSubmit={handleSubmit}
            />
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
