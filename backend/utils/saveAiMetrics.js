import pool from "../configs/db.js";

// Pricing per 1 million tokens (USD) — update if model pricing changes
const MODEL_PRICING = {
	"gemini-3.1-pro-preview": { inputPerM: 2.0, outputPerM: 12.0 },
	"gemini-2.5-flash": { inputPerM: 0.3, outputPerM: 2.5 },
};

const DEFAULT_PRICING = { inputPerM: 0.3, outputPerM: 2.5 };

// Calculates approximate cost in USD from token counts and model name
const calcApproxCost = (model, inputTokens, outputTokens) => {
	const pricing = MODEL_PRICING[model] ?? DEFAULT_PRICING;
	const inputCost = (inputTokens / 1_000_000) * pricing.inputPerM;
	const outputCost = (outputTokens / 1_000_000) * pricing.outputPerM;
	return inputCost + outputCost;
};

// Inserts one AI metrics row for a completed (or failed) LLM call
const saveAiMetrics = async (jobId, { modelUsed, inputTokens, outputTokens, totalTokens, startedAt, respondedAt }) => {
	const approxCost = calcApproxCost(modelUsed, inputTokens, outputTokens);

	await pool.query(
		`INSERT INTO ai_metrics
      (job_id, model_used, input_tokens, output_tokens, total_tokens, approx_cost, started_at, responded_at, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() AT TIME ZONE 'UTC')`,
		[jobId, modelUsed, inputTokens, outputTokens, totalTokens, approxCost, startedAt, respondedAt],
	);
};

export default saveAiMetrics;
