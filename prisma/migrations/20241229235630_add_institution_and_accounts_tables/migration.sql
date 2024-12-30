/*
  Warnings:

  - You are about to drop the `PlaidSyncCursor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PlaidSyncCursor";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Institution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "institutionId" TEXT NOT NULL,
    "institutionName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtype" TEXT NOT NULL,
    "currentBalance" REAL NOT NULL,
    CONSTRAINT "Account_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution" ("institutionId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Institution_institutionId_key" ON "Institution"("institutionId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_accountId_key" ON "Account"("accountId");
