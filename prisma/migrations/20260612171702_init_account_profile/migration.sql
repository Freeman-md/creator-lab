-- CreateTable
CREATE TABLE "account_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "current_profile_version_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "account_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_versions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "writing_preferences" JSONB NOT NULL DEFAULT '[]',
    "content_patterns" JSONB NOT NULL DEFAULT '[]',
    "revision_patterns" JSONB NOT NULL DEFAULT '[]',
    "avoid_patterns" JSONB NOT NULL DEFAULT '[]',
    "user_instructions" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_profiles_user_id_key" ON "account_profiles"("user_id");

-- CreateIndex
CREATE INDEX "account_profiles_current_profile_version_id_idx" ON "account_profiles"("current_profile_version_id");

-- CreateIndex
CREATE INDEX "profile_versions_user_id_created_at_idx" ON "profile_versions"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "profile_versions_id_user_id_key" ON "profile_versions"("id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_versions_user_id_version_key" ON "profile_versions"("user_id", "version");

-- AddForeignKey
ALTER TABLE "account_profiles" ADD CONSTRAINT "account_profiles_current_profile_version_id_user_id_fkey" FOREIGN KEY ("current_profile_version_id", "user_id") REFERENCES "profile_versions"("id", "user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
