import express from "express";
import { getMetrics } from "../controllers/metrics.js";

const metricsRouter = express.Router();

metricsRouter.get("/", getMetrics);

export default metricsRouter;
