import express from "express";
import {
  getSqlJoinsDemo,
  runLlmIntegrationDemo,
  getDemoOverview,
} from "../controllers/demoController.js";

const router = express.Router();

router.get("/overview", getDemoOverview);
router.get("/sql-joins", getSqlJoinsDemo);
router.post("/llm", runLlmIntegrationDemo);

export default router;
