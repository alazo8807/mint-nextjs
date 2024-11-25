-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT,
    "unofficialCurrency" TEXT,
    "date" DATETIME NOT NULL,
    "authorizedDate" DATETIME,
    "name" TEXT NOT NULL,
    "merchantName" TEXT,
    "pending" BOOLEAN NOT NULL,
    "pendingTransactionId" TEXT,
    "category" TEXT,
    "paymentChannel" TEXT NOT NULL,
    "transactionType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Transaction" ("accountId", "amount", "authorizedDate", "category", "createdAt", "currency", "date", "id", "merchantName", "name", "paymentChannel", "pending", "pendingTransactionId", "transactionType", "unofficialCurrency", "updatedAt") SELECT "accountId", "amount", "authorizedDate", "category", "createdAt", "currency", "date", "id", "merchantName", "name", "paymentChannel", "pending", "pendingTransactionId", "transactionType", "unofficialCurrency", "updatedAt" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
