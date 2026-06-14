import { Bot, Check, Paperclip, Play, Send, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { postEditorMessages } from "./post-editor-data";

export function AssistantPanel() {
  return (
    <section className="flex h-full flex-col bg-card">
      <div className="flex-1 space-y-8 overflow-y-auto px-6 py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center text-muted-foreground">
          <Bot className="size-8 text-foreground" />
          <p className="max-w-xs text-sm leading-6">{postEditorMessages.assistantIntro}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="max-w-[85%] rounded-3xl rounded-tr-md border border-border bg-muted px-5 py-3 text-sm leading-6 text-foreground">
            {postEditorMessages.userPrompt}
          </div>
          <span className="text-xs text-muted-foreground">10:42 AM</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <WandSparkles className="size-4" />
            Assistant
          </div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {postEditorMessages.assistantSummary}
          </p>

          <Card className="overflow-hidden rounded-2xl border-border shadow-none">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30 p-4">
              <div className="text-sm font-medium text-foreground">
                {postEditorMessages.suggestionTitle}
              </div>
              <span className="text-xs text-muted-foreground">
                {postEditorMessages.suggestionVersion}
              </span>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="space-y-4 text-sm leading-6 text-foreground">
                {postEditorMessages.suggestionBody.split("\n\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" className="rounded-md">
                  Discard
                </Button>
                <Button type="button" className="rounded-md">
                  <Check data-icon="inline-start" />
                  Accept
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="border-t border-border bg-card px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {postEditorMessages.quickActions.map((action) => (
            <Button
              key={action}
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 rounded-full"
            >
              {action === "Make it punchy" ? <Play data-icon="inline-start" /> : null}
              {action}
            </Button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-background p-2">
          <div className="flex items-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="mb-1 shrink-0 rounded-lg text-muted-foreground"
              aria-label="Attach file"
            >
              <Paperclip />
            </Button>
            <Textarea
              placeholder="Message AI Assistant..."
              className="min-h-11 border-0 bg-transparent px-2 py-2 shadow-none focus-visible:ring-0"
            />
            <Button type="button" size="icon-sm" className="mb-1 shrink-0 rounded-lg">
              <Send />
            </Button>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </section>
  );
}
