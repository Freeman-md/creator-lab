import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type PostPerformancePreviewProps = {
  category?: string;
  publishedAt?: string;
  title?: string;
  description?: string;
};

const defaultPostPerformancePreview = {
  category: "Design Systems",
  publishedAt: "Jan 15, 2024",
  title: "The Architecture of Minimalist SaaS Interfaces",
  description:
    "Exploring how reductionism and functional density create calm control in professional tools.",
};

export function PostPerformancePreview({
  category = defaultPostPerformancePreview.category,
  publishedAt = defaultPostPerformancePreview.publishedAt,
  title = defaultPostPerformancePreview.title,
  description = defaultPostPerformancePreview.description,
}: PostPerformancePreviewProps) {
  return (
    <Card className="shadow-none">
      <CardContent className="flex gap-4 p-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
          <div className="size-9 rounded-full bg-foreground/15" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Badge variant="secondary">{category}</Badge>
            <span className="text-xs text-muted-foreground">Published on {publishedAt}</span>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="truncate text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
