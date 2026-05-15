"use client";

import { Job } from "@/types/job";
import Link from "next/link";

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
		<div className="bg-foreground border border-border rounded-lg p-6 flex flex-col items-center gap-4 text-center">
			<p className="text-sm text-secondary">{statusLabel[job.status] ?? "Checking status..."}</p>

			{/* Spinner while pending or processing */}
			{(job.status === "pending" || job.status === "processing") && (
				<div className="w-7 h-7 rounded-full border-[3px] border-vorder border-t-accent animate-spin" />
			)}

			{job.status === "done" && job.downloadUrl && (
				<Link
					href={job.downloadUrl}
					download
					className="bg-accent hover:bg-accent-hover text-white rounded-lg px-5 py-2.5 text-sm transition-colors">
					Download PPT
				</Link>
			)}

			{job.status === "failed" && <p className="text-sm text-error">{job.error ?? "Something went wrong."}</p>}

			{pollError && <p className="text-sm text-error">{pollError}</p>}
		</div>
	);
}
