export type JobStatus = "pending" | "processing" | "done" | "failed";

export interface Job {
	jobId: string;
	status: JobStatus;
	downloadUrl?: string;
	error?: string;
}
