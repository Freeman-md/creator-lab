"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PostStatusBadge } from "./post-status-badge";

type PostStatus = "Draft" | "Published";

type PostRow = {
  title: string;
  author: string;
  status: PostStatus;
  updatedAt: string;
  channel: string;
  views: string;
};

function getPostHref(status: PostStatus) {
  return status === "Published" ? "/posts/performance" : "/posts/new";
}

const posts: PostRow[] = [
  {
    title: "The Future of Design Systems",
    author: "Freeman",
    status: "Draft",
    updatedAt: "2 hours ago",
    channel: "LinkedIn",
    views: "--",
  },
  {
    title: "10 Rules for Better UI",
    author: "Freeman",
    status: "Published",
    updatedAt: "Today",
    channel: "Blog",
    views: "3.4K",
  },
  {
    title: "Typography in Modern Interfaces",
    author: "Freeman",
    status: "Draft",
    updatedAt: "Yesterday",
    channel: "LinkedIn",
    views: "--",
  },
  {
    title: "Mastering Framer Motion",
    author: "Freeman",
    status: "Published",
    updatedAt: "Jun 8",
    channel: "YouTube",
    views: "1.2K",
  },
  {
    title: "Why Tailwind CSS Wins",
    author: "Freeman",
    status: "Published",
    updatedAt: "Jun 3",
    channel: "Blog",
    views: "8.9K",
  },
];

const statusFilters = ["All", "Draft", "Published"] as const;

type StatusFilter = (typeof statusFilters)[number];

export function PostsTable() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredPosts = posts.filter((post) => {
    const matchesStatus = statusFilter === "All" || post.status === statusFilter;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      post.title.toLowerCase().includes(normalizedQuery) ||
      post.channel.toLowerCase().includes(normalizedQuery);

    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Button
              key={filter}
              type="button"
              variant={statusFilter === filter ? "default" : "outline"}
              className="rounded-md"
              onClick={() => setStatusFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts..."
            className="h-10 rounded-md border-border bg-background pl-9 shadow-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Views</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <TableRow key={post.title}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Link
                        href={getPostHref(post.status)}
                        className="font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {post.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">By {post.author}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <PostStatusBadge status={post.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{post.channel}</TableCell>
                  <TableCell className="text-muted-foreground">{post.updatedAt}</TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {post.views}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No posts match your current search and filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
