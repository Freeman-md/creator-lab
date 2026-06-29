import type { FunctionReturnType } from "convex/server";

import { api } from "@convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AnalysisDetailData = FunctionReturnType<typeof api.analyses.get>;

type AnalysisInsightsTabsProps = {
  lessons: AnalysisDetailData["lessons"];
  patterns: AnalysisDetailData["patterns"];
};

function groupLessons(lessons: AnalysisDetailData["lessons"]) {
  return {
    repeat: lessons.filter((lesson) => lesson.type === "repeat"),
    avoid: lessons.filter((lesson) => lesson.type === "avoid"),
    improve: lessons.filter((lesson) => lesson.type === "improve"),
  };
}

function groupPatterns(patterns: AnalysisDetailData["patterns"]) {
  return {
    positive: patterns.filter((pattern) => pattern.sentiment === "positive"),
    negative: patterns.filter((pattern) => pattern.sentiment === "negative"),
  };
}

export function AnalysisInsightsTabs({
  lessons,
  patterns,
}: AnalysisInsightsTabsProps) {
  const groupedLessons = groupLessons(lessons);
  const groupedPatterns = groupPatterns(patterns);

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-semibold tracking-tight">
          Lessons and patterns
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="lessons">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>
          <TabsContent value="lessons" className="pt-4">
            <div className="flex flex-col gap-4">
              {(
                [
                  ["Repeat", groupedLessons.repeat],
                  ["Avoid", groupedLessons.avoid],
                  ["Improve", groupedLessons.improve],
                ] as const
              ).map(([title, sectionLessons]) => (
                <div
                  key={title}
                  className="rounded-xl border border-border bg-muted/25 p-4"
                >
                  <h3 className="font-heading text-base font-semibold tracking-tight">
                    {title}
                  </h3>
                  {sectionLessons.length === 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      No {title.toLowerCase()} lessons were produced.
                    </p>
                  ) : (
                    <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-6 text-foreground">
                      {sectionLessons.map((lesson) => (
                        <li key={lesson.id}>{lesson.content}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="patterns" className="pt-4">
            <div className="flex flex-col gap-4">
              {(
                [
                  ["Positive", groupedPatterns.positive],
                  ["Negative", groupedPatterns.negative],
                ] as const
              ).map(([title, sectionPatterns]) => (
                <div
                  key={title}
                  className="rounded-xl border border-border bg-muted/25 p-4"
                >
                  <h3 className="font-heading text-base font-semibold tracking-tight">
                    {title}
                  </h3>
                  {sectionPatterns.length === 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      No {title.toLowerCase()} patterns were produced.
                    </p>
                  ) : (
                    <div className="mt-3 flex flex-col gap-3">
                      {sectionPatterns.map((pattern) => (
                        <div
                          key={pattern.id}
                          className="rounded-lg border border-border bg-card p-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="font-medium text-foreground">
                              {pattern.name}
                            </h4>
                            <span className="font-mono text-xs text-muted-foreground">
                              Score {pattern.score.toFixed(2)}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {pattern.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
