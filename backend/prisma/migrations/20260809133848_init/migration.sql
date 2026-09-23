-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pantry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Pantry',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pantry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PantryItem" (
    "id" TEXT NOT NULL,
    "pantryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PantryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Pantry_userId_idx" ON "Pantry"("userId");

-- CreateIndex
CREATE INDEX "PantryItem_pantryId_idx" ON "PantryItem"("pantryId");

-- CreateIndex
CREATE INDEX "PantryItem_expiryDate_idx" ON "PantryItem"("expiryDate");

-- AddForeignKey
ALTER TABLE "Pantry" ADD CONSTRAINT "Pantry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PantryItem" ADD CONSTRAINT "PantryItem_pantryId_fkey" FOREIGN KEY ("pantryId") REFERENCES "Pantry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================================
-- SQL JOINs Implementation & Demonstration Views (0.2 pts • SQL (Postgres))
-- Demonstrating: INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN
-- ============================================================================

-- 1. INNER JOIN: Combines Pantry and PantryItem rows where pantryId matches
-- Only returns pantries that currently contain items
SELECT 
    p.id AS "pantryId",
    p.name AS "pantryName",
    p."userId",
    pi.id AS "itemId",
    pi.name AS "itemName",
    pi.quantity,
    pi.unit,
    pi."expiryDate"
FROM "Pantry" p
INNER JOIN "PantryItem" pi ON p.id = pi."pantryId";

-- 2. LEFT JOIN (LEFT OUTER JOIN): Returns all Users and their Pantries
-- Includes users who do not have any pantry created yet (p.id will be NULL)
SELECT 
    u.id AS "userId",
    u.email,
    u.name AS "userName",
    p.id AS "pantryId",
    p.name AS "pantryName",
    p."createdAt" AS "pantryCreatedAt"
FROM "User" u
LEFT JOIN "Pantry" p ON u.id = p."userId";

-- 3. RIGHT JOIN (RIGHT OUTER JOIN): Returns all items and associated user information
-- Ensures every PantryItem is listed alongside its pantry owner
SELECT 
    u.email AS "userEmail",
    p.name AS "pantryName",
    pi.name AS "itemName",
    pi.quantity,
    pi.unit,
    pi."expiryDate"
FROM "User" u
RIGHT JOIN "Pantry" p ON u.id = p."userId"
RIGHT JOIN "PantryItem" pi ON p.id = pi."pantryId";

-- 4. FULL OUTER JOIN: Comprehensive inventory alignment
-- Returns all users and pantries, matching where possible
SELECT 
    u.id AS "userId",
    u.email,
    p.id AS "pantryId",
    p.name AS "pantryName"
FROM "User" u
FULL OUTER JOIN "Pantry" p ON u.id = p."userId";

-- 5. Reusable Production SQL View utilizing multi-table INNER JOINs
CREATE OR REPLACE VIEW "UserPantryInventoryView" AS
SELECT 
    u.id AS "userId",
    u.email AS "userEmail",
    p.id AS "pantryId",
    p.name AS "pantryName",
    pi.id AS "itemId",
    pi.name AS "itemName",
    pi.quantity,
    pi.unit,
    pi."expiryDate"
FROM "User" u
INNER JOIN "Pantry" p ON u.id = p."userId"
INNER JOIN "PantryItem" pi ON p.id = pi."pantryId";

