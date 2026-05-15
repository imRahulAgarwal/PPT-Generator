import pool from "../configs/db.js";

// Updates a job row — pass only the fields that need to change
const updateJobStatus = async (jobId, { status, s3Key, errorMessage, servedFromCache, completedAt }) => {
	const fields = [];
	const values = [];
	let idx = 1;

	if (status !== undefined) {
		fields.push(`status = $${idx++}`);
		values.push(status);
	}
	if (s3Key !== undefined) {
		fields.push(`s3_key = $${idx++}`);
		values.push(s3Key);
	}
	if (errorMessage !== undefined) {
		fields.push(`error_message = $${idx++}`);
		values.push(errorMessage);
	}

	if (servedFromCache !== undefined) {
		fields.push(`served_from_cache = $${idx++}`);
		values.push(servedFromCache);
	}
	if (completedAt !== undefined) {
		fields.push(`completed_at = $${idx++}`);
		values.push(completedAt.toISOString());
	}

	fields.push(`updated_at = NOW() AT TIME ZONE 'UTC'`);
	values.push(jobId);

	const query = `UPDATE jobs SET ${fields.join(", ")} WHERE id = $${idx}`;
	await pool.query(query, values);
};

export default updateJobStatus;
