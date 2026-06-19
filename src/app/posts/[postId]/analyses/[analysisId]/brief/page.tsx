import { BriefDetailView } from "@/modules/briefs/components/brief-detail-view";

type BriefDetailPageProps = {
  params: Promise<{
    analysisId: string;
  }>;
};

export default async function BriefDetailPage({
  params,
}: BriefDetailPageProps) {
  const { analysisId } = await params;

  return <BriefDetailView analysisId={analysisId} />;
}
