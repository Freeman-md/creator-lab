import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardPageHeader } from "../components/dashboard-page-header";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <DashboardPageHeader
        title="Platform Configuration"
        description="Manage your workspace settings and AI integrations."
      />

      <Card className="shadow-none">
        <CardHeader className="space-y-1 p-5">
          <h2 className="text-lg font-semibold">OpenAI Integration</h2>
          <p className="text-sm text-muted-foreground">
            Configure your API credentials to power AI features.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-5 pt-0">
          <div className="space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium text-foreground">
              API Key
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="api-key"
                type="password"
                value="sk-********************************"
                readOnly
                className="h-10 rounded-md border-border bg-muted/50 text-sm shadow-none"
              />
              <Button variant="outline" className="h-10 rounded-md">
                Test Connection
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Your key is stored securely and never shared.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader className="space-y-1 p-5">
          <h2 className="text-lg font-semibold">AI Behavior</h2>
          <p className="text-sm text-muted-foreground">
            Define the overarching instructions for the assistant.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-5 pt-0">
          <div className="space-y-2">
            <label htmlFor="system-prompt" className="text-sm font-medium text-foreground">
              Global System Prompt
            </label>
            <textarea
              id="system-prompt"
              className="min-h-32 w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none"
              defaultValue="You are an expert technical writer and UI designer. Focus on clarity, brevity, and modern web standards."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="skill-prompt" className="text-sm font-medium text-foreground">
              Specific Skill Prompt
            </label>
            <textarea
              id="skill-prompt"
              className="min-h-40 w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none"
              defaultValue={`When asked to review code:\n1. Identify severity vulnerabilities.\n2. Suggest performance optimizations.\n3. Provide adherence to SOLID principles if applicable.\n4. Create a brief refactor summary.`}
            />
          </div>
          <div className="flex justify-end">
            <Button className="rounded-md px-4">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
