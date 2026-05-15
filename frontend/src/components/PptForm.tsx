"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { pptSchema, PptFormValues } from "@/lib/schemas/pptSchema";
import { createJob } from "@/lib/api/jobs";
import { usePollJob } from "@/hooks/usePollJob";
import JobStatusCard from "@/components/JobStatusCard";

const GRADE_OPTIONS = [
	"Kindergarten",
	"Grade 1",
	"Grade 2",
	"Grade 3",
	"Grade 4",
	"Grade 5",
	"Grade 6",
	"Grade 7",
	"Grade 8",
	"Grade 9",
	"Grade 10",
	"Grade 11",
	"Grade 12",
];

export default function PptForm() {
	const [jobId, setJobId] = useState<string | null>(null);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const { job, pollError } = usePollJob(jobId);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<PptFormValues>({
		resolver: zodResolver(pptSchema),
		defaultValues: { numberOfSlides: 10 },
	});

	const onSubmit = async (data: PptFormValues) => {
		setSubmitError(null);
		setJobId(null);
		try {
			const newJob = await createJob(data);
			setJobId(newJob.jobId);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "Unexpected error.";
			setSubmitError(message);
		}
	};

	return (
		<div className="form-wrapper">
			<form onSubmit={handleSubmit(onSubmit)} className="ppt-form" noValidate>
				<div className="field-group">
					<label htmlFor="topic">Topic</label>
					<input id="topic" type="text" placeholder="e.g. Photosynthesis" {...register("topic")} />
					{errors.topic && <span className="field-error">{errors.topic.message}</span>}
				</div>

				<div className="field-group">
					<label htmlFor="grade">Grade Level</label>
					<select id="grade" {...register("grade")}>
						<option value="">Select a grade</option>
						{GRADE_OPTIONS.map((grade) => (
							<option key={grade} value={grade}>
								{grade}
							</option>
						))}
					</select>
					{errors.grade && <span className="field-error">{errors.grade.message}</span>}
				</div>

				<div className="field-group">
					<label htmlFor="numberOfSlides">Number of Slides</label>
					<input
						id="numberOfSlides"
						type="number"
						min={3}
						max={30}
						{...register("numberOfSlides", { valueAsNumber: true })}
					/>
					{errors.numberOfSlides && <span className="field-error">{errors.numberOfSlides.message}</span>}
				</div>

				{submitError && <p className="error-text">{submitError}</p>}

				<button type="submit" disabled={isSubmitting} className="submit-btn">
					{isSubmitting ? "Submitting..." : "Generate Presentation"}
				</button>
			</form>

			<JobStatusCard job={job} pollError={pollError} />
		</div>
	);
}
