-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "profile_version_id" UUID NOT NULL,
    "title" TEXT,
    "draft_content" TEXT NOT NULL,
    "supporting_context" TEXT,
    "reference_urls" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posts_user_id_created_at_idx" ON "posts"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "posts_profile_version_id_idx" ON "posts"("profile_version_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_profile_version_id_user_id_fkey" FOREIGN KEY ("profile_version_id", "user_id") REFERENCES "profile_versions"("id", "user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
