import { z } from "zod";

export const pptSchema = z.object({
	topic: z.string().min(3, "Topic must be at least 3 characters"),
	grade: z.string().min(1, "Grade level is required"),
	numberOfSlides: z
		.number({ error: "Must be a number" })
		.int()
		.min(3, "Minimum 3 slides")
		.max(30, "Maximum 30 slides"),
});

export type PptFormValues = z.infer<typeof pptSchema>;
