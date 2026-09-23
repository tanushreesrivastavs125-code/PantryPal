import { executeAllJoinTypesDemonstration } from "../services/sqlJoinsService.js";
import { executeLlmIntegration } from "../demo/llmApiIntegrationDemo.js";

/**
 * Demo Controller
 * Exposes viva concepts and dummy implementations via API
 */

// 1. SQL JOINs Demo
export const getSqlJoinsDemo = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const data = await executeAllJoinTypesDemonstration(userId);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// 2. LLM API Integration Demo
export const runLlmIntegrationDemo = async (req, res, next) => {
  try {
    const { userQuery, pantryItems } = req.body || {};
    const userId = req.user?.id || "demo-user";
    const result = await executeLlmIntegration({
      userId,
      userQuery,
      pantryItems,
    });
    res.status(200).json({
      success: true,
      data: result.data,
      metadata: result.metadata,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Demo Overview & Rubric Status
export const getDemoOverview = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      topics: [
        {
          name: "SQL JOINs",
          weight: "0.2 pts",
          category: "SQL (Postgres)",
          files: [
            "backend/prisma/migrations/20260809133848_init/migration.sql",
            "backend/src/demo/sql_joins_demo.sql",
            "backend/src/services/sqlJoinsService.js",
            "backend/src/demo/sqlJoinsDemo.js",
          ],
        },
        {
          name: "Async data fetching from API",
          weight: "0.2 pts",
          category: "Frontend",
          files: [
            "frontend/src/demo/asyncDataFetchingDemo.js",
            "frontend/src/demo/AsyncDataFetchingDemo.jsx",
          ],
        },
        {
          name: "LLM API integration",
          weight: "0.2 pts",
          category: "AI App Eng",
          files: [
            "backend/src/demo/llmApiIntegrationDemo.js",
            "backend/src/services/aiService.js",
            "backend/src/services/aiChatService.js",
          ],
        },
        {
          name: "JavaScript — Promises vs callbacks",
          weight: "0.1 pts",
          category: "Frontend",
          files: [
            "frontend/src/demo/promisesVsCallbacksDemo.js",
            "frontend/src/demo/PromisesVsCallbacksDemo.jsx",
          ],
        },
      ],
    },
  });
};
