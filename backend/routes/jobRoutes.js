import express from "express";
import * as job from "../controllers/job.js";
import { createJobLimiter } from "../middlewares/rateLimiter.js";

const jobRouter = express.Router();

jobRouter.post("/", createJobLimiter, job.createJob);
jobRouter.get("/:id", job.getJob);

export default jobRouter;
