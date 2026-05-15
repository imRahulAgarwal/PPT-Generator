import pool from "../configs/db.js";
import StorageService from "../services/StorageService.js";
import logger from "../services/LoggerService.js";

const storageService = new StorageService();
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

// Finds jobs whose files are older than 10 minutes and deletes them from S3
const runCleanup = async () => {
	logger.info("FILE_CLEANUP_START", "Running file cleanup cron");

	let result;
	try {
		result = await pool.query(`
            SELECT id, s3_key FROM jobs
            WHERE status = 'done'
              AND is_file_deleted_from_cloud_storage = FALSE
              AND s3_key IS NOT NULL
              AND completed_at + INTERVAL '10 minutes' <= NOW() AT TIME ZONE 'UTC'
        `);
	} catch (err) {
		logger.error("FILE_CLEANUP_QUERY_FAILED", "Failed to query jobs for cleanup", { error: err.message });
		return;
	}

	if (result.rows.length === 0) {
		logger.info("FILE_CLEANUP_SKIP", "No files eligible for deletion");
		return;
	}

	for (const job of result.rows) {
		try {
			await storageService.deleteFile(job.s3_key);

			await pool.query(
				`UPDATE jobs
                 SET is_file_deleted_from_cloud_storage = TRUE,
                     deleted_at   = NOW() AT TIME ZONE 'UTC',
                     updated_at   = NOW() AT TIME ZONE 'UTC'
                 WHERE id = $1`,
				[job.id],
			);

			logger.success("FILE_DELETED", "S3 file deleted and job updated", { jobId: job.id, s3Key: job.s3_key });
		} catch (err) {
			// Log and continue — one failure should not stop the rest
			logger.error("FILE_DELETE_FAILED", "Failed to delete S3 file", { jobId: job.id, error: err.message });
		}
	}
};

// Run once on start, then every 10 minutes
runCleanup();
setInterval(runCleanup, CLEANUP_INTERVAL_MS);
