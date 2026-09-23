-- ============================================================================
-- SQL JOINs Comprehensive Demonstration File
-- Topic: SQL JOINs (0.2 pts • SQL (Postgres))
-- Project: PantryPal Smart Kitchen Management System
-- ============================================================================

-- ============================================================================
-- 1. INNER JOIN
-- Purpose: Return only records that have matching values in both tables.
-- Use case in PantryPal: Retrieve all pantry items along with their parent pantry name.
-- Pantries with no items, or items with no valid pantry, will NOT be returned.
-- ============================================================================
SELECT 
    p.id AS pantry_id,
    p.name AS pantry_name,
    p."userId" AS user_id,
    pi.id AS item_id,
    pi.name AS item_name,
    pi.quantity,
    pi.unit,
    pi."expiryDate" AS expiry_date
FROM "Pantry" p
INNER JOIN "PantryItem" pi 
    ON p.id = pi."pantryId"
ORDER BY p.name ASC, pi.name ASC;

-- ============================================================================
-- 2. LEFT JOIN (LEFT OUTER JOIN)
-- Purpose: Return ALL records from the left table ("User"), and matched records 
-- from the right table ("Pantry"). If no match exists, NULLs are returned for right table columns.
-- Use case in PantryPal: Find all registered users, whether or not they have created a pantry.
-- ============================================================================
SELECT 
    u.id AS user_id,
    u.email,
    u.name AS user_name,
    p.id AS pantry_id,
    COALESCE(p.name, 'No Pantry Created') AS pantry_name,
    p."createdAt" AS pantry_created_at
FROM "User" u
LEFT JOIN "Pantry" p 
    ON u.id = p."userId"
ORDER BY u.email ASC;

-- ============================================================================
-- 3. RIGHT JOIN (RIGHT OUTER JOIN)
-- Purpose: Return ALL records from the right table ("PantryItem"), and matched
-- records from the left table ("Pantry").
-- Use case in PantryPal: Audit every inventory item to ensure it links to an active pantry.
-- ============================================================================
SELECT 
    p.name AS pantry_name,
    pi.name AS item_name,
    pi.quantity,
    pi.unit,
    pi."expiryDate"
FROM "Pantry" p
RIGHT JOIN "PantryItem" pi 
    ON p.id = pi."pantryId";

-- ============================================================================
-- 4. FULL OUTER JOIN
-- Purpose: Return all records when there is a match in either left or right table.
-- Use case in PantryPal: Complete reconciliation report between users and pantries.
-- ============================================================================
SELECT 
    u.id AS user_id,
    u.email,
    p.id AS pantry_id,
    p.name AS pantry_name
FROM "User" u
FULL OUTER JOIN "Pantry" p 
    ON u.id = p."userId";

-- ============================================================================
-- 5. MULTI-TABLE JOIN (3-Way INNER JOIN)
-- Purpose: Join Users -> Pantries -> PantryItems in a single query.
-- Use case in PantryPal: Fetch a complete inventory breakdown for a specific user.
-- ============================================================================
SELECT 
    u.id AS user_id,
    u.email,
    p.name AS pantry_name,
    pi.name AS ingredient_name,
    pi.quantity,
    pi.unit,
    pi."expiryDate"
FROM "User" u
INNER JOIN "Pantry" p 
    ON u.id = p."userId"
INNER JOIN "PantryItem" pi 
    ON p.id = pi."pantryId"
WHERE u.id = 'sample-user-id'
ORDER BY pi."expiryDate" ASC NULLS LAST;

-- ============================================================================
-- 6. LEFT JOIN with Aggregation (GROUP BY & COUNT)
-- Purpose: Aggregate items per pantry, including pantries that have 0 items.
-- ============================================================================
SELECT 
    p.id AS pantry_id,
    p.name AS pantry_name,
    COUNT(pi.id) AS total_items,
    COALESCE(SUM(pi.quantity), 0) AS total_quantity
FROM "Pantry" p
LEFT JOIN "PantryItem" pi 
    ON p.id = pi."pantryId"
GROUP BY p.id, p.name
ORDER BY total_items DESC;
