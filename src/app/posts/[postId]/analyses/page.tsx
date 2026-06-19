import { AnalysisListView } from "@/modules/analyses/components/analysis-list-view";

type AnalysesPageProps = {
  params: Promise<{
    postId: string;
  }>;
};

export default async function AnalysesPage({ params }: AnalysesPageProps) {
  const { postId } = await params;

  return <AnalysisListView postId={postId} />;
}
