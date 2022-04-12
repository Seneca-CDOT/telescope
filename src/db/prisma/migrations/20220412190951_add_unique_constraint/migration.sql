/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `feeds` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "feeds_id_key" ON "feeds"("id");
