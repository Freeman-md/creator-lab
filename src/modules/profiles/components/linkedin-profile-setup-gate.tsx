"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import { api } from "@convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LinkedInProfileUrlForm,
  LinkedInProfileUrlFormValues,
} from "@/modules/profiles/components/linkedin-profile-url-form";

type LinkedInProfileSetupGateProps = {
  children: React.ReactNode;
};

export function LinkedInProfileSetupGate({
  children,
}: LinkedInProfileSetupGateProps) {
  const pathname = usePathname();
  const profile = useQuery(api.profiles.getCurrent, {});
  const upsertProfile = useMutation(api.profiles.upsertLinkedInProfile);
  const [isSaving, setIsSaving] = useState(false);
  const shouldPrompt =
    profile === null && !pathname?.startsWith("/dashboard/settings");

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
    <>
      {children}
      <Dialog open={shouldPrompt}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Add your LinkedIn profile</DialogTitle>
            <DialogDescription>
              This lets Creator Lab import your recent posts from the right
              profile.
            </DialogDescription>
          </DialogHeader>
          <LinkedInProfileUrlForm
            submitLabel="Save profile"
            isSaving={isSaving}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
