"use client";

import { Job } from "@/types/job";

interface JobStatusCardProps {
	job: Job | null;
	pollError: string | null;
}

const statusLabel: Record<string, string> = {
	pending: "Queued — waiting to start...",
	processing: "Generating your presentation...",
	done: "Your presentation is ready!",
	failed: "Generation failed.",
};

export default function JobStatusCard({ job, pollError }: JobStatusCardProps) {
	if (!job) return null;

	return (
		<div className="status-card">
			<p className="status-label">{statusLabel[job.status] ?? "Checking status..."}</p>

			{/* Show spinner while job is in progress */}
			{(job.status === "pending" || job.status === "processing") && (
				<div className="spinner" aria-label="Loading" />
			)}

			{job.status === "done" && job.downloadUrl && (
				<a href={job.downloadUrl} download className="download-btn">
					Download PPT
				</a>
			)}

			{job.status === "failed" && <p className="error-text">{job.error ?? "Something went wrong."}</p>}

			{pollError && <p className="error-text">{pollError}</p>}
		</div>
	);
}
