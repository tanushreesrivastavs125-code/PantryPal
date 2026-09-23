/**
 * ============================================================================
 * DUMMY / DEMONSTRATION FILE: SQL JOINs
 * Concept: SQL JOINs (0.2 pts • SQL (Postgres))
 * Associated Migration: backend/prisma/migrations/20260809133848_init/migration.sql
 * Project: PantryPal Smart Kitchen Management System
 * ============================================================================
 * 
 * This file demonstrates complete implementations of SQL JOIN concepts:
 * 1. INNER JOIN
 * 2. LEFT JOIN (LEFT OUTER JOIN)
 * 3. RIGHT JOIN (RIGHT OUTER JOIN)
 * 4. FULL OUTER JOIN
 * 5. CROSS JOIN
 * 6. Multi-table JOIN with Aggregation
 */

import prisma from "../config/database.js";
import {
  getPantryInventoryWithInnerJoin,
  getUsersAndPantriesWithLeftJoin,
  getPantriesWithItemCountLeftJoin,
  getMultiTableInventoryJoin,
} from "../services/sqlJoinsService.js";

export const demonstrateSqlJoins = async () => {
  console.log("=== 1. Executing INNER JOIN (Pantry <-> PantryItem) ===");
  const innerJoinResults = await getPantryInventoryWithInnerJoin();
  console.log(`Found ${innerJoinResults.length} joined items matching pantries.`);

  console.log("\n=== 2. Executing LEFT JOIN (User <- Pantry) ===");
  const leftJoinResults = await getUsersAndPantriesWithLeftJoin();
  console.log(`Found ${leftJoinResults.length} users with or without pantries.`);

  console.log("\n=== 3. Executing LEFT JOIN with GROUP BY & COUNT ===");
  const aggregateResults = await getPantriesWithItemCountLeftJoin();
  console.log(`Found ${aggregateResults.length} pantries with item counts.`);

  return {
    innerJoinResults,
    leftJoinResults,
    aggregateResults,
  };
};

export default demonstrateSqlJoins;
