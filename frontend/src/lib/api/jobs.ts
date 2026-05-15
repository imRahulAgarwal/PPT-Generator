import { Job } from "@/types/job";
import { PptFormValues } from "@/lib/schemas/pptSchema";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Submit a new PPT generation job
export async function createJob(formData: PptFormValues): Promise<Job> {
	const response = await fetch(`${BASE_URL}/jobs`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ ...formData, language: "English" }),
	});

	if (!response.ok) {
		throw new Error("Failed to create job. Please try again.");
	}

	return response.json();
}

// Fetch current job status and download URL if ready
export async function getJob(jobId: string): Promise<Job> {
	const response = await fetch(`${BASE_URL}/jobs/${jobId}`);

	if (!response.ok) {
		throw new Error("Failed to fetch job status.");
	}

	return response.json();
}
