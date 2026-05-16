import { setTimeout as delay } from "timers/promises";

const BASE_URL = "https://ppt-generator-api-production-82ed.up.railway.app";
const POLL_INTERVAL_MS = 4000;

// 2 unique topics + 3 similar topics (to trigger semantic cache hits)
const jobPayloads = [
	{ topic: "The Solar System", grade: "Grade 5", numberOfSlides: 5 },
	{ topic: "World War II", grade: "Grade 8", numberOfSlides: 7 },
	{ topic: "Solar System and Planets", grade: "Grade 5", numberOfSlides: 5 }, // similar to #1
	{ topic: "Our Solar System", grade: "Grade 5", numberOfSlides: 5 }, // similar to #1
	{ topic: "Planets in the Solar System", grade: "Grade 5", numberOfSlides: 5 }, // similar to #1
];

// Creates a single job and returns the jobId
const createJob = async (payload, index) => {
	const response = await fetch(`${BASE_URL}/jobs`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Job ${index + 1} creation failed [${response.status}]: ${body}`);
	}

	const data = await response.json();
	return data.jobId;
};

// Polls GET /jobs/:id until status is 'done' or 'failed'
const pollUntilDone = async (jobId, index) => {
	while (true) {
		const response = await fetch(`${BASE_URL}/jobs/${jobId}`);

		if (!response.ok) {
			throw new Error(`Poll failed for job ${index + 1} [${response.status}]`);
		}

		const data = await response.json();

		if (data.status === "done" || data.status === "failed") {
			return data;
		}

		await delay(POLL_INTERVAL_MS);
	}
};

// Runs a single job end-to-end: create → poll → return result with timing
const runJob = async (payload, index) => {
	const startedAt = Date.now();

	try {
		const jobId = await createJob(payload, index);
		console.log(`[Job ${index + 1}] Created — jobId: ${jobId} | Topic: "${payload.topic}"`);

		const result = await pollUntilDone(jobId, index);
		const durationMs = Date.now() - startedAt;

		return { index: index + 1, jobId, status: result.status, durationMs, error: result.error ?? null };
	} catch (err) {
		const durationMs = Date.now() - startedAt;
		return { index: index + 1, jobId: null, status: "error", durationMs, error: err.message };
	}
};

const main = async () => {
	console.log("Starting load test — firing 5 concurrent job requests...\n");

	const scriptStartedAt = Date.now();

	// Fire all 5 jobs concurrently and wait for all to reach terminal state
	const results = await Promise.all(jobPayloads.map((payload, index) => runJob(payload, index)));

	const totalDurationMs = Date.now() - scriptStartedAt;

	// Print individual results
	console.log("\n--- Results ---");
	for (const result of results) {
		const duration = (result.durationMs / 1000).toFixed(2);
		console.log(
			`Job ${result.index} | Status: ${result.status.toUpperCase()} | Duration: ${duration}s` +
				(result.error ? ` | Error: ${result.error}` : ""),
		);
	}

	// Print summary metrics
	const successful = results.filter((r) => r.status === "done").length;
	const failed = results.filter((r) => r.status !== "done").length;
	const avgDuration = results.reduce((sum, r) => sum + r.durationMs, 0) / results.length;

	console.log("\n--- Summary ---");
	console.log(`Total time      : ${(totalDurationMs / 1000).toFixed(2)}s`);
	console.log(`Successful jobs : ${successful}`);
	console.log(`Failed jobs     : ${failed}`);
	console.log(`Avg job duration: ${(avgDuration / 1000).toFixed(2)}s`);
};

main();
