import { Queue } from "bullmq";
import { v4 as uuidv4 } from "uuid";

import pool from "../configs/db.js";
import redisConnection from "../configs/redis.js";
import StorageService from "../services/StorageService.js";
import createJobSchema from "../schemas/job.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import logger from "../services/LoggerService.js";

const pptQueue = new Queue("pptQueue", { connection: redisConnection });
const storageService = new StorageService();

// POST /jobs — creates a new PPT generation job
const createJob = asyncHandler(async (req, res) => {
	const result = createJobSchema.safeParse(req.body);

	if (!result.success) {
		console.log(req.body);
		console.log(result);
		const errors = result.error.issues.map((issue) => issue.message);
		return res.status(400).json({ success: false, errors });
	}

	const { topic, grade, numberOfSlides } = result.data;
	const jobId = uuidv4();

	// Insert job row before queuing so status is trackable immediately
	await pool.query(
		`INSERT INTO jobs (id, topic, grade, number_of_slides, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, 'pending', NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC')`,
		[jobId, topic, grade, numberOfSlides],
	);

	await pptQueue.add("generatePpt", { jobId, topic, grade, numberOfSlides });

	logger.success("CREATE_JOB", "Job queued successfully", { jobId, topic, grade, numberOfSlides });

	return res.status(201).json({ jobId, status: "pending" });
});

// GET /jobs/:id — returns job status; if done, includes a presigned download URL
const getJob = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const result = await pool.query(`SELECT id, status, s3_key, error_message FROM jobs WHERE id = $1`, [id]);

	if (result.rows.length === 0) {
		return res.status(404).json({ error: "Job not found." });
	}

	const job = result.rows[0];
	const response = { jobId: job.id, status: job.status };

	if (job.status === "done" && job.s3_key) {
		response.downloadUrl = await storageService.getPresignedUrl(job.s3_key);
	}

	if (job.status === "failed") {
		response.error = job.error_message;
	}

	return res.json(response);
});

export { createJob, getJob };
