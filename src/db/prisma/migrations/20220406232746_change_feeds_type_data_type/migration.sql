-- Case-insensitive text type
CREATE EXTENSION IF NOT EXISTS citext;

-- CreateEnum
CREATE TYPE "FeedType" AS ENUM ('blog', 'youtube', 'twitch');

-- CreateTable
CREATE TABLE "feeds" (
    "url" TEXT NOT NULL,
    "user_id" TEXT,
    "wiki_author_name" TEXT,
    "html_url" TEXT,
    "type" "FeedType" DEFAULT E'blog',
    "invalid" BOOLEAN DEFAULT false,
    "flagged" BOOLEAN DEFAULT false,

    CONSTRAINT "feeds_pkey" PRIMARY KEY ("url")
);

-- CreateTable
CREATE TABLE "github_issues" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "repo" INTEGER NOT NULL,
    "type" CITEXT NOT NULL,

    CONSTRAINT "github_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_repositories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner" INTEGER NOT NULL,

    CONSTRAINT "github_repositories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_users" (
    "id" SERIAL NOT NULL,
    "login" CITEXT NOT NULL,
    "type" CITEXT NOT NULL,

    CONSTRAINT "github_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "quote_id" SERIAL NOT NULL,
    "author_name" TEXT NOT NULL,
    "blog_url" TEXT NOT NULL,
    "quote" TEXT NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("quote_id")
);

-- CreateTable
CREATE TABLE "telescope_profiles" (
    "id" TEXT NOT NULL,
    "registered_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "display_name" CITEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" CITEXT NOT NULL,
    "github_username" CITEXT NOT NULL,
    "github_avatar_url" TEXT NOT NULL,

    CONSTRAINT "telescope_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "github_issues_repo_number_key" ON "github_issues"("repo", "number");

-- CreateIndex
CREATE UNIQUE INDEX "github_repositories_owner_name_key" ON "github_repositories"("owner", "name");

-- CreateIndex
CREATE UNIQUE INDEX "telescope_profiles_display_name_key" ON "telescope_profiles"("display_name");

-- CreateIndex
CREATE UNIQUE INDEX "telescope_profiles_email_key" ON "telescope_profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "telescope_profiles_github_username_key" ON "telescope_profiles"("github_username");

-- AddForeignKey
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "telescope_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "github_issues" ADD CONSTRAINT "github_issues_repo_fkey" FOREIGN KEY ("repo") REFERENCES "github_repositories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "github_repositories" ADD CONSTRAINT "github_repositories_owner_fkey" FOREIGN KEY ("owner") REFERENCES "github_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
