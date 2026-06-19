import { PostDetailView } from "@/modules/posts/components/post-detail-view";

type PostDetailPageProps = {
  params: Promise<{
    postId: string;
  }>;
};

export default async function PostDetailPage({
  params,
}: PostDetailPageProps) {
  const { postId } = await params;

  return <PostDetailView postId={postId} />;
}
