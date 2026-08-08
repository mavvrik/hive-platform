/*
  Warnings:

  - You are about to drop the column `accentColor` on the `PlatformIdentity` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundUrl` on the `PlatformIdentity` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `PlatformIdentity` table. All the data in the column will be lost.
  - You are about to drop the column `mascotUrl` on the `PlatformIdentity` table. All the data in the column will be lost.
  - You are about to drop the column `primaryColor` on the `PlatformIdentity` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryColor` on the `PlatformIdentity` table. All the data in the column will be lost.
  - You are about to drop the column `terminologyJson` on the `PlatformIdentity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlatformIdentity" DROP COLUMN "accentColor",
DROP COLUMN "backgroundUrl",
DROP COLUMN "logoUrl",
DROP COLUMN "mascotUrl",
DROP COLUMN "primaryColor",
DROP COLUMN "secondaryColor",
DROP COLUMN "terminologyJson",
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "IdentityBranding" (
    "id" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "accentColor" TEXT,
    "logoUrl" TEXT,
    "mascotUrl" TEXT,
    "backgroundUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdentityBranding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdentityTerminology" (
    "id" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "termKey" TEXT NOT NULL,
    "displayValue" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdentityTerminology_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IdentityBranding_identityId_key" ON "IdentityBranding"("identityId");

-- CreateIndex
CREATE INDEX "IdentityTerminology_identityId_idx" ON "IdentityTerminology"("identityId");

-- CreateIndex
CREATE UNIQUE INDEX "IdentityTerminology_identityId_termKey_key" ON "IdentityTerminology"("identityId", "termKey");

-- AddForeignKey
ALTER TABLE "IdentityBranding" ADD CONSTRAINT "IdentityBranding_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "PlatformIdentity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdentityTerminology" ADD CONSTRAINT "IdentityTerminology_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "PlatformIdentity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
