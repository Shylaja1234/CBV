-- AlterTable
ALTER TABLE "User" ADD COLUMN     "department" TEXT DEFAULT 'Not Assigned',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'inactive';
