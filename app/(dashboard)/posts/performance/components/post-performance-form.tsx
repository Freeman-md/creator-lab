import { BarChart3, MessageSquareText, Save, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export function PostPerformanceForm() {
  return (
    <form className="flex flex-col gap-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="impressions">Impressions</Label>
            <div className="relative">
              <BarChart3 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="impressions"
                type="number"
                placeholder="0"
                className="h-11 rounded-md border-border bg-background pl-9 shadow-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="reactions">Total Reactions</Label>
            <div className="relative">
              <ThumbsUp className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="reactions"
                type="number"
                placeholder="0"
                className="h-11 rounded-md border-border bg-background pl-9 shadow-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="reaction-breakdown">Reaction Breakdown</Label>
          <Input
            id="reaction-breakdown"
            type="text"
            placeholder="e.g., 45 Likes, 12 Reposts, 5 Bookmarks"
            className="h-11 rounded-md border-border bg-background shadow-none"
          />
        </div>

        <Separator />

        <div className="flex flex-col gap-5">
          <div className="flex max-w-sm flex-col gap-2">
            <Label htmlFor="comment-count">Comment Count</Label>
            <div className="relative">
              <MessageSquareText className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="comment-count"
                type="number"
                placeholder="0"
                className="h-11 rounded-md border-border bg-background pl-9 shadow-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="comment-notes">Key Commenters / Notes</Label>
            <Textarea
              id="comment-notes"
              placeholder="List notable accounts or insights from the discussion..."
              className="min-h-32 rounded-md border-border bg-background shadow-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" className="rounded-md">
            Cancel
          </Button>
          <Button type="submit" className="rounded-md">
            <Save data-icon="inline-start" />
            Save Performance
          </Button>
        </div>
      </form>
  );
}
