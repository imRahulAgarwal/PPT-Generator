"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { pptSchema, PptFormValues } from "@/lib/schemas/pptSchema";
import { createJob } from "@/lib/api/jobs";
import { usePollJob } from "@/hooks/usePollJob";
import JobStatusCard from "@/components/JobStatusCard";

const GRADE_OPTIONS = [
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

	const inputClass =
		"bg-background text-primary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full";

	return (
		<div className="flex flex-col gap-6 w-full">
			{/* Form card */}
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className="bg-foreground border border-border rounded-lg p-6 flex flex-col gap-5">
				{/* Topic */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="topic" className="text-xs font-medium text-secondary uppercase tracking-wide">
						Topic
					</label>
					<input
						id="topic"
						type="text"
						placeholder="e.g. Photosynthesis"
						className={inputClass}
						{...register("topic")}
					/>
					{errors.topic && <span className="text-xs text-error">{errors.topic.message}</span>}
				</div>

				{/* Grade */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="grade" className="text-xs font-medium text-secondary uppercase tracking-wide">
						Grade Level
					</label>
					<select id="grade" className={inputClass} {...register("grade")}>
						<option value="">Select a grade</option>
						{GRADE_OPTIONS.map((grade) => (
							<option key={grade} value={grade}>
								{grade}
							</option>
						))}
					</select>
					{errors.grade && <span className="text-xs text-error">{errors.grade.message}</span>}
				</div>

				{/* Number of slides */}
				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="numberOfSlides"
						className="text-xs font-medium text-secondary uppercase tracking-wide">
						Number of Slides
					</label>
					<input
						id="numberOfSlides"
						type="number"
						min={3}
						max={30}
						className={inputClass}
						{...register("numberOfSlides", { valueAsNumber: true })}
					/>
					{errors.numberOfSlides && (
						<span className="text-xs text-error">{errors.numberOfSlides.message}</span>
					)}
				</div>

				{submitError && <p className="text-sm text-error">{submitError}</p>}

				<button
					type="submit"
					disabled={isSubmitting}
					className="mt-1 bg-accent hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer">
					{isSubmitting ? "Submitting..." : "Generate Presentation"}
				</button>
			</form>

			<JobStatusCard job={job} pollError={pollError} />
		</div>
	);
}
