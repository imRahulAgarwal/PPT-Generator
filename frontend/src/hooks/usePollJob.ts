import { useEffect, useRef, useState } from "react";
import { getJob } from "@/lib/api/jobs";
import { Job } from "@/types/job";

const POLL_INTERVAL_MS = 4000;

// Polls the job status every 4s until it reaches a terminal state
export function usePollJob(jobId: string | null) {
	const [job, setJob] = useState<Job | null>(null);
	const [pollError, setPollError] = useState<string | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (!jobId) return;

		const poll = async () => {
			try {
				const updatedJob = await getJob(jobId);
				setJob(updatedJob);

				// Stop polling once job reaches a terminal state
				if (updatedJob.status === "done" || updatedJob.status === "failed") {
					clearInterval(intervalRef.current!);
				}
			} catch {
				setPollError("Could not reach the server. Retrying...");
			}
		};

		poll(); // immediate first call
		intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

		return () => clearInterval(intervalRef.current!);
	}, [jobId]);

	return { job, pollError };
}
