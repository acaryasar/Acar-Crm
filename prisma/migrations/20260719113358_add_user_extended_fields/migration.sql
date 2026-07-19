-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EMPLOYEE',
    "phone" TEXT,
    "nationalId" TEXT,
    "dateOfBirth" DATETIME,
    "gender" TEXT,
    "profilePicture" TEXT,
    "username" TEXT,
    "changePasswordOnFirstLogin" BOOLEAN NOT NULL DEFAULT false,
    "accountStatus" BOOLEAN NOT NULL DEFAULT true,
    "accountEndDate" DATETIME,
    "department" TEXT,
    "position" TEXT,
    "workplace" TEXT,
    "manager" TEXT,
    "startDate" DATETIME,
    "description" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'TR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME
);
INSERT INTO "new_User" ("createdAt", "deletedAt", "email", "firstName", "id", "is_active", "lastName", "locale", "password", "role", "updatedAt") SELECT "createdAt", "deletedAt", "email", "firstName", "id", "is_active", "lastName", "locale", "password", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
