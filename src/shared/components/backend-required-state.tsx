import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppShell } from "@/shared/components/app-shell";

type BackendRequiredStateProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function BackendRequiredState({
  eyebrow,
  title,
  description,
}: BackendRequiredStateProps) {
  return (
    <AppShell eyebrow={eyebrow} title={title} description={description}>
      <Alert className="border-border bg-card">
        <AlertTitle>Convex connection missing</AlertTitle>
        <AlertDescription>
          `NEXT_PUBLIC_CONVEX_URL` is not available in this environment, so the
          workspace cannot load live post, analysis, or brief data yet.
        </AlertDescription>
      </Alert>
    </AppShell>
  );
}
