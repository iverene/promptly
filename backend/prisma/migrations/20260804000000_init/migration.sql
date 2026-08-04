CREATE TABLE "folders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "folder_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "prompts" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "notes" TEXT,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "prompts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "folders_name_idx" ON "folders"("name");
CREATE INDEX "folders_is_archived_updated_at_idx" ON "folders"("is_archived", "updated_at");
CREATE UNIQUE INDEX "categories_folder_id_name_key" ON "categories"("folder_id", "name");
CREATE INDEX "categories_folder_id_sort_order_idx" ON "categories"("folder_id", "sort_order");
CREATE INDEX "prompts_category_id_is_archived_updated_at_idx" ON "prompts"("category_id", "is_archived", "updated_at");
CREATE INDEX "prompts_is_favorite_is_archived_idx" ON "prompts"("is_favorite", "is_archived");
CREATE INDEX "prompts_title_idx" ON "prompts"("title");

ALTER TABLE "categories" ADD CONSTRAINT "categories_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
