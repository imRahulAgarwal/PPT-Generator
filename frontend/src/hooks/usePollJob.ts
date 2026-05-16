import { useEffect, useRef, useState } from "react";
import { getJob } from "@/lib/api/jobs";
import { Job } from "@/types/job";

const POLL_INTERVAL_MS = 4000;
const MAX_CONSECUTIVE_ERRORS = 3;

// Polls the job status every 4s until it reaches a terminal state
export function usePollJob(jobId: string | null) {
	const [job, setJob] = useState<Job | null>(null);
	const [pollError, setPollError] = useState<string | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const [consecutiveErrors, setConsecutiveErrors] = useState(0);

	useEffect(() => {
		if (!jobId) return;

		const poll = async () => {
			try {
				const updatedJob = await getJob(jobId);
				setJob(updatedJob);
				setConsecutiveErrors(0);
				setPollError(null);

				// Stop polling once job reaches a terminal state
				if (updatedJob.status === "done" || updatedJob.status === "failed") {
					clearInterval(intervalRef.current!);
				}
			} catch {
				setConsecutiveErrors((prev) => {
					const next = prev + 1;
					if (next >= MAX_CONSECUTIVE_ERRORS) {
						clearInterval(intervalRef.current!);
						setPollError("Server unreachable. Please refresh and try again.");
					} else {
						setPollError("Could not reach the server. Retrying...");
					}
					return next;
				});
			}
		};

		poll(); // immediate first call
		intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

		return () => clearInterval(intervalRef.current!);
	}, [jobId]);

	return { job, pollError };
}
