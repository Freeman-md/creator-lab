import Link from "next/link";
import { FileTextIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type EmptyStateProps = {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: React.ReactNode;
  actionHref?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
};

export function EmptyState({
  className = "min-h-[480px] border-border bg-card",
  icon = <FileTextIcon />,
  title = "No posts saved yet",
  description = (
    <>
      Start by adding one published LinkedIn post. Creator Lab will carry it
      through metrics, analysis, and the brief loop from there.
    </>
  ),
  actionHref = "/dashboard/posts/new",
  actionLabel = "Create your first post",
  actionIcon = <PlusIcon data-icon="inline-start" />,
}: EmptyStateProps) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href={actionHref}>
            {actionIcon}
            {actionLabel}
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
