import pool from "../configs/db.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const getMetrics = asyncHandler(async (req, res) => {
	// LLM usage stats — only from actual generation calls (cache hits have no ai_metrics row)
	const llmResult = await pool.query(`
        SELECT
            COALESCE(SUM(approx_cost), 0) AS total_cost,
            COALESCE(SUM(input_tokens), 0) AS total_input_tokens,
            COALESCE(SUM(output_tokens), 0) AS total_output_tokens,
            COALESCE(SUM(total_tokens), 0) AS total_tokens,
            COUNT(*) AS total_content_generated,
            COALESCE(AVG(approx_cost), 0) AS average_cost,
            COALESCE(AVG(EXTRACT(EPOCH FROM (responded_at - started_at)) * 1000), 0) AS avg_generation_time_ms
        FROM ai_metrics
    `);

	// Job-level stats
	const jobResult = await pool.query(`
        SELECT
            COUNT(*) FILTER (WHERE served_from_cache = TRUE)  AS total_cache_hits,
            COUNT(*) FILTER (WHERE status = 'failed')         AS total_failures
        FROM jobs
    `);

	const llm = llmResult.rows[0];
	const jobs = jobResult.rows[0];

	const totalCacheHits = Number(jobs.total_cache_hits);
	const averageCost = Number(llm.average_cost);

	// Estimated cost saved = each cache hit avoided one LLM call worth avg cost
	const costSavedByCaching = totalCacheHits * averageCost;

	return res.json({
		totalCost: Number(llm.total_cost),
		totalInputTokens: Number(llm.total_input_tokens),
		totalOutputTokens: Number(llm.total_output_tokens),
		totalTokens: Number(llm.total_tokens),
		totalContentGenerated: Number(llm.total_content_generated),
		totalCacheHits,
		costSavedByCaching,
		averageCost,
		averageContentGenerationTimeMs: Number(llm.avg_generation_time_ms),
		totalFailures: Number(jobs.total_failures),
	});
});

export { getMetrics };
