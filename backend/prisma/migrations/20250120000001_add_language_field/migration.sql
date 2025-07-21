-- Migration für language Feld
-- AlterTable
ALTER TABLE "User" ADD COLUMN "language" TEXT DEFAULT 'en';

-- Update existing users to have default language
UPDATE "User" SET "language" = 'en' WHERE "language" IS NULL;
