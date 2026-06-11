import { FileText, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DashboardPageHeader } from "../components/dashboard-page-header";

const stats = [
  {
    label: "Total Posts",
    value: "142",
    note: "+12 this month",
  },
  {
    label: "Avg Impressions",
    value: "8.4K",
    note: "+4.2% vs last period",
  },
  {
    label: "Best Performer",
    value: "AI Rules for Better UI",
    note: "4.1K impressions",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <DashboardPageHeader
        title="Overview"
        description="Manage your drafts, publications, and monitor performance."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-none">
            <CardHeader className="space-y-1 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {stat.label}
              </p>
            </CardHeader>
            <CardContent className="space-y-2 p-5 pt-0">
              <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between p-5">
            <div>
              <h2 className="text-base font-semibold">Draft Queue</h2>
              <p className="text-sm text-muted-foreground">
                Priority drafts waiting for review before publication.
              </p>
            </div>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3 p-5 pt-0">
            {["The Future of Design Systems", "Typography in Modern Interfaces", "My 2024 Design Tool Stack"].map(
              (title) => (
                <div
                  key={title}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">Last updated 3 days ago</p>
                  </div>
                  <span className="rounded-full bg-background px-2.5 py-1 text-xs text-muted-foreground">
                    Draft
                  </span>
                </div>
              ),
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between p-5">
            <div>
              <h2 className="text-base font-semibold">Recent Performance</h2>
              <p className="text-sm text-muted-foreground">
                Published posts making the strongest impact this week.
              </p>
            </div>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3 p-5 pt-0">
            {[
              ["10 Rules for Better UI", "3.4K impressions"],
              ["Mastering Framer Motion", "1.2K impressions"],
              ["Why Tailwind CSS Wins", "8.9K impressions"],
            ].map(([title, metric]) => (
              <div
                key={title}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground">Published Dec 28</p>
                </div>
                <p className="text-sm font-medium text-foreground">{metric}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
