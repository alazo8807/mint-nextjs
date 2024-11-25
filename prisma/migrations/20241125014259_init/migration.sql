-- CreateTable
CREATE TABLE "Transaction" (
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
    "transactionType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
