import { AnalysisDetailView } from "@/modules/analyses/components/analysis-detail-view";

type AnalysisDetailPageProps = {
  params: Promise<{
    postId: string;
    analysisId: string;
  }>;
};

export default async function AnalysisDetailPage({
  params,
}: AnalysisDetailPageProps) {
  const { postId, analysisId } = await params;

  return <AnalysisDetailView postId={postId} analysisId={analysisId} />;
}
