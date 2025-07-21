-- AlterTable
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- Update existing users with temporary usernames
UPDATE "User" SET "username" = 'user' || "id" WHERE "username" IS NULL;

-- Make username NOT NULL
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;